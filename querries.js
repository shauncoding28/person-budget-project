const pool = require('./db');




const getEnvelopes = (req, res) => {
    pool.query('SELECT * FROM envelopes ORDER BY id ASC', (error, results) => {
        if (error) {
            throw (error)
        }
        res.status(200).json(results.rows);
    })
}

const getTransactions = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        throw (error);
    }
};



const createEnvelope = (req, res, next) => {
    const { name, amount } = req.body;

    if (!name || amount == null) {
        return res.status(400).send('Name and amount required');
    }

    // Creates new envelope
    const query = 'INSERT INTO envelopes (name, amount) VALUES ($1, $2) RETURNING *';
    const values = [name, amount];

    pool.query(query, values, (error, result) => {
        if (error) {
            res.status(400).send();
            throw error; // Corrected syntax
        }

        // Ensure result is defined here
        res.status(200).json({
            message: 'New envelope created!',
            envelope: result.rows[0]
        });
    });
};




const envelopeById = async (req, res, next) => {
    try {
        const envelopeId = parseInt(req.params.id, 10); // Converts id to integer
        const query = 'SELECT * FROM envelopes WHERE id = $1';
        const values = [envelopeId];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).send('Envelope with requested id does not exist');
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};



const withdrawFromEnvelope = async (req, res, next) => {
    try {
        const envelopeId = parseInt(req.params.id, 10);
        const requestedAmount = parseFloat(req.body.amount);

        const amountQuery = 'SELECT amount FROM envelopes WHERE id = $1';
        const result = await pool.query(amountQuery, [envelopeId]);

        // check envelope with amount exists
        if (result.rows.length === 0) {
            return res.status(404).send('Envelope not found');
        }

        // removes unwanted symbols
        const currentAmount = parseFloat(result.rows[0].amount);
        if (isNaN(currentAmount) || isNaN(requestedAmount)) {
            return res.status(400).send('Invalid amount');
        }

        const newAmount = currentAmount - requestedAmount;
        console.log(`Current Amount: ${currentAmount}, Requested Amount: ${requestedAmount}, New Amount: ${newAmount}`);

        // verifies funds are sufficient
        if (newAmount < 0) {
            return res.status(400).send('Insufficient funds');
        }

        //updates envelope amount
        const updateQuery = 'UPDATE envelopes SET amount = $1 WHERE id = $2';
        await pool.query(updateQuery, [newAmount, envelopeId]);

        res.status(200).json({ id: envelopeId, newAmount });
    } catch (error) {
        next(error);
    }
};


const envelopeTransfer = async (req, res, next) => {
    const requestedAmount = parseFloat(req.body.amount.replace(/[^0-9.-]+/g, ""));
    const fromId = parseInt(req.params.from, 10);
    const toId = parseInt(req.params.to, 10);

    try {
        await pool.query('BEGIN');

        // Check if the source envelope has sufficient funds
        const amountQuery = 'SELECT amount FROM envelopes WHERE id = $1';
        const fromResult = await pool.query(amountQuery, [fromId]);

        if (fromResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).send('Source envelope not found');
        }

        const currentAmount = parseFloat(fromResult.rows[0].amount.replace(/[^0-9.-]+/g, ""));
        if (currentAmount < requestedAmount) {
            await pool.query('ROLLBACK');
            return res.status(400).send('Insufficient funds');
        }

        // Subtract from the source envelope
        const subtractQuery = 'UPDATE envelopes SET amount = amount - $1 WHERE id = $2';
        await pool.query(subtractQuery, [requestedAmount, fromId]);

        // Add to the destination envelope
        const addQuery = 'UPDATE envelopes SET amount = amount + $1 WHERE id = $2';
        await pool.query(addQuery, [requestedAmount, toId]);

        // Get's receivers name
        const nameQuery = 'SELECT name FROM envelopes WHERE id = $1'
        response = await pool.query(nameQuery, [toId]);
        const receiverName = response.rows[0].name;

        // Logs transfer in transactions table
        const transactionsQuery = 'INSERT INTO transactions (amount, recipient, envelope_id) VALUES ($1, $2, $3)';
        await pool.query(transactionsQuery, [requestedAmount, receiverName, fromId]);


        await pool.query('COMMIT');

        res.status(200).send('Transfer successful');

    } catch (error) {
        await pool.query('ROLLBACK');
        throw (error);
    }
};



const deleteEnvelope = async (req, res, next) => {

    try {
        const envelopeId = parseInt(req.params.id, 10);

        const verificationQuery = 'SELECT * FROM envelopes WHERE id = $1';
        const query = 'DELETE FROM envelopes WHERE id = $1'

        //Verifies envelope exists
        const verificationResult = await pool.query(verificationQuery, [envelopeId]);
        if (verificationResult.rows.length === 0) { return res.status(404).send('Envelope not found!') };

        // deletes envelope
        await pool.query(query, [envelopeId]);

        res.status(200).send('Letter deleted succesfully');


    } catch (error) {
        throw (error);
    };
};





module.exports = {
    getEnvelopes,
    getTransactions,
    createEnvelope,
    envelopeById,
    withdrawFromEnvelope,
    envelopeTransfer,
    deleteEnvelope
};

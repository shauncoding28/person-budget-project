const { envelopes, nextId, totalBudget } = require('./data');


function findEnvById(req, res, next) {
    const envelopeId = parseInt(req.params.id, 10); //converts id to integer
    const envelope = envelopes.find(env => env.id === envelopeId); //verifies envelope with Id exists and assigns


    //returns error status if envelop is not found
    if (!envelope) {
        res.status(404).send('Envelope not found');
        return;
    }

    req.envelope = envelope;
    next();
}

module.exports = { findEnvById, };
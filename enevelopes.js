const express = require('express');
const router = express.Router();

let totalBudget = 1000;
let envelopes = [];

router.post('/', (req, res, next) => {
    const { name, amount } = req.body;

    if (!name || amount == null) {
        return res.sendStatus(400).send('Name and amount required');
    }

    const newEnvelope = { name, amount }
    envelopes.push(newEnvelope);
    res.status(201).send(newEnvelope);
})

module.exports = router;
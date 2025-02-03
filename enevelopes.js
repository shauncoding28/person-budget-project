const express = require('express');
const router = express.Router();
const { findEnvById } = require('./middleware');
let { envelopes, nextId, totalBudget } = require('./data');





// adds new object to envelopes array
router.post('/', (req, res, next) => {
    const { name, amount } = req.body;

    if (!name || amount == null) {
        return res.status(400).send('Name and amount required');
    }

    const newEnvelope = { id: nextId++, name, amount }
    envelopes.push(newEnvelope);
    res.status(201).send(newEnvelope);
})



// GET endpoint to retrieve all envelopes
router.get('/', (req, res, next) => {
    res.status(200).json(envelopes);
})


// GET endpoint to retrieve all envelopes
router.get('/:id', findEnvById, (req, res, next) => {
    res.status(200).send(req.envelope);
})



router.put('/:id', findEnvById, (req, res, next) => {


    const requestedAmount = req.body.amount; //assigns requested amount to variable


    //return error message if funds in envelope are not suuficient
    if (requestedAmount > req.envelope.amount) {
        res.status(400).send('Insufficent funds');
        return;
    }

    req.envelope.amount -= requestedAmount; //subtracts the requested amount from the envelope

    res.status(200).json(req.envelope); //send success message with updated envelope
})



router.post('/transfers/:from/:to', (req, res, next) => {
    const requestedAmount = req.body.amount;
    const fromId = parseInt(req.params.from, 10);
    const toId = parseInt(req.params.to, 10);

    const envelopeFrom = envelopes.find(env => env.id === fromId);
    const envelopeTo = envelopes.find(env => env.id === toId);

    if (!envelopeFrom || !envelopeTo || requestedAmount > envelopeFrom.amount) {
        res.status(400).send("Something went wrong please make sure funds are sufficient, check input and try again");
        return;
    }

    envelopeFrom.amount -= requestedAmount;
    envelopeTo.amount += requestedAmount;
    res.status(200).json({ envelopeFrom, envelopeTo });

})



// deletes an envelope of specified id
router.delete('/:id', findEnvById, (req, res, next) => {

    //filters through envelopes to update envelopes array excluding envelope with id matching the request
    envelopes = envelopes.filter(env => env.id !== req.envelope.id);

    //return success status/message
    res.status(200).send('Letter deleted succesfully');
})


module.exports = router;
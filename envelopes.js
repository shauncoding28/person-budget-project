const express = require('express');
const router = express.Router();
require('dotenv').config();
const db = require('./querries'); // imports query logic from querries.js file
const { envelopeTransfer } = require('./querries'); //
const { getTransactions } = require('./querries');
const pool = require('./db');




// POST endpoint adds new object to envelopes array
router.post('/', db.createEnvelope);


// GET endpoint to retrieve all envelopes
router.get('/', db.getEnvelopes);


// Get endpoint to retrieve all transactions
router.get('/transactions', db.getTransactions);


// GET endpoint to retrieve all envelopes
router.get('/:id', db.envelopeById);



// PUT endpoint to withdraw from an envelope
router.put('/:id', db.withdrawFromEnvelope);


// POST endpoint to transfer from one envelope to another
router.post('/transfers/:from/:to', envelopeTransfer);


// DELETE endpoint deletes an envelope of specified id
router.delete('/:id', db.deleteEnvelope);

module.exports = router;
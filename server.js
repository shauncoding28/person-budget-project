const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler')

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;



const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler')


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello, World');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

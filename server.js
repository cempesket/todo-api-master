const express = require('express');
const bodyParser = require('body-parser');

require('./config/config');
require('./db/mongoose');

const router = require('./route/route');

const app = express();

app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send({message: 'Welcome. Go to /api'})
});

app.use('/api', router);

app.use('/*', (req, res, next) => {
    res.status(404).send({message: 'There is nothing here'});
    next()
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});

module.exports = app;




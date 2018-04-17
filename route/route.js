const express = require('express');

const todoRouter = require('./todo.route');

const router = express.Router();


router.get('/', (req, res) => {
    res.send({message: 'Welcome to todo api'})
});
router.use('/todos', todoRouter);

module.exports = router;
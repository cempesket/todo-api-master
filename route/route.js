const express = require('express');

const todoRouter = require('./todo.route');

const userRouter = require('./user.route');

const router = express.Router();


router.get('/', (req, res) => {
    res.send({message: 'Welcome to todo api'})
});
router.use('/todos', todoRouter);
router.use('/user',userRouter);

module.exports = router;
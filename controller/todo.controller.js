const Todo = require('../model/Todo');
const {ObjectID} = require('mongodb');

module.exports.addTodo = async (req, res) => {
    const newTodo = new Todo(req.body);
    try {
        const insertedTodo = await newTodo.save();
        res.send(insertedTodo)
    } catch (err) {
        res.status(400).send(err.text)
    }
};
module.exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({});
        res.send(todos)
    } catch (err) {
        res.status(400).send(err.text)
    }
};
module.exports.getTodo = async (req, res) => {
    let todo = {};
    try {
        const id = req.params.id;

        if (!ObjectID.isValid(id))
            res.status(400).send({message: 'Invalid id'});

        todo = await Todo.findById(id);

        if (!todo)
            res.status(404).send({message: 'No user found'});
        res.send(todo);
    } catch (err) {
    }
};

module.exports.deleteTodo = async (req, res) => {
    let todo = {};
    try {
        const id = req.params.id;
        if (!ObjectID.isValid(id))
            res.status(400).send({message: 'Invalid id'});

        todo = await Todo.findByIdAndRemove(id);
        if (!todo)
            res.status(404).send({message: 'No user found'});
        res.send(todo)
    } catch (e) {
    }
};
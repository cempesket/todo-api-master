const {ObjectID} = require('mongodb');
const _ = require('lodash');

const Todo = require('../model/Todo');

module.exports.addTodo = async (req, res) => {
    const newTodo = new Todo({...req.body, userId: req.user.id});
    try {
        const insertedTodo = await newTodo.save();
        res.send(insertedTodo)
    } catch (err) {
        res.status(400).send(err.text)
    }
};
module.exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({userId:req.user.id});
        res.send(todos)
    } catch (err) {
        res.status(400).send(err.text)
    }
};
module.exports.getTodo = async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectID.isValid(id))
            res.status(400).send({message: 'Invalid id'});

        const todo = await Todo.findOne({_id:id,userId:req.user.id});

        if (!todo)
            res.status(404).send({message: 'No todo found'});
        res.send(todo);
    } catch (err) {
    }
};

module.exports.deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectID.isValid(id))
            res.status(400).send({message: 'Invalid id'});

        const todo = await Todo.findOneAndRemove({_id:id,userId:req.user.id});
        if (!todo)
            res.status(404).send({message: 'No todo found'});
        res.send(todo)
    } catch (e) {
    }
};
module.exports.updateTodo = async (req, res) => {
    const id = req.params.id;
    try {
        if (!ObjectID.isValid(id))
            res.status(400).send({message: 'Invalid id'});

        const body = _.pick(req.body, ['text', 'completed']);
        if (!_.isBoolean(body.completed) || (!body.completed && body.completed !== false))
            res.status(400).send({message: 'Invalid post body'});

        if (body.completed) {
            body.completedAt = new Date();
        }
        const todo = await Todo.findOneAndUpdate({_id:id,userId:req.user.id}, {$set: body}, {new: true});
        if (!todo)
            res.status(404).send({message: 'No todo found'});
        res.send(todo)
    } catch (e) {
        res.status(400).send()
    }
};
const Todo = require('../../model/Todo');
const {user} = require('../seed/user.seed');

const {ObjectID} = require('mongodb');

const id = new ObjectID();
const todo = {text: 'Something to do', _id: id,userId: user[0]._id };


const populate = async () => {
    await Todo.remove({});
    const newTodo = new Todo(todo);
    await newTodo.save();
};

module.exports = {id, todo, populate};
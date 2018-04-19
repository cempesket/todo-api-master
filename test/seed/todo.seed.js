const Todo = require('../../model/Todo');

const {ObjectID} = require('mongodb');

const todo = {text: 'Something to do', _id: new ObjectID()};


const populate = async () => {
    await Todo.remove({});
    const newTodo = new Todo(todo);
    await newTodo.save();
};

module.exports = {todo, populate};
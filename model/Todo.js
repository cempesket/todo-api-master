const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const todoSchema = new Schema({
    text: {type: String, required: true},
    completed: {type: Boolean, default: false},
    completedAt: {type: Date},
    userId: {type: String}
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
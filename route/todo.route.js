const express = require('express');

const todoController = require('../controller/todo.controller');

const router = express.Router();

router.get('/',todoController.getTodos);
router.get('/:id',todoController.getTodo);

router.post('/',todoController.addTodo);

router.delete('/delete/:id',todoController.deleteTodo);

router.patch('/update/:id',todoController.updateTodo);


module.exports = router;
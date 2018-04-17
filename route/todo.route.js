const express = require('express');

const todoController = require('../controller/todo.controller');

const router = express.Router();

router.post('/',todoController.addTodo);
router.get('/',todoController.getTodos);
router.get('/:id',todoController.getTodo);


module.exports = router;
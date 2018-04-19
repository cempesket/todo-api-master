const express = require('express');

const auth = require('../auth/auth');
const userController = require('../controller/user.controller');

const router = express.Router();

router.post('/', userController.addUser);
router.get('/me', auth.isAuth, userController.getUser);
router.post('/me/login', userController.loginUser);
router.delete('/me/logout', auth.isAuth, userController.logoutUser);

module.exports = router;

const _ = require('lodash');

const User = require('../model/User');


module.exports.addUser = async (req, res) => {

    const body = _.pick(req.body, ['email', 'password']);

    const newUser = new User(body);
    try {
        const token = await newUser.generateToken();
        res.header('x-auth', token).send({status: 200})
    } catch (e) {
        res.status(400).send({message: e.message})
    }
};

module.exports.getUser = (req, res) => {
    const user = req.user;
    res.json(user)
};


const _ = require('lodash');

const User = require('../model/User');


module.exports.addUser = async (req, res) => {

    const body = _.pick(req.body, ['email', 'password']);

    const newUser = new User(body);
    try {
        const object = await newUser.generateToken();
        res.header('x-auth', object.token).send({status: 200, user: _.pick(object.insertedUser, ['email', '_id'])})
    } catch (e) {
        res.status(400).send({message: e.message})
    }
};

module.exports.getUser = (req, res) => {
    const user = req.user;
    res.json(user)
};
module.exports.loginUser = async (req, res) => {
    const user = _.pick(req.body, ['email', 'password']);
    if (user && user !== {}) {
        const foundUser = await User.identifyUser(user.email, user.password);
        if (foundUser) {
            const obj = await foundUser.generateToken();
            res.header('x-auth', obj.token).send()
        }
    } else {
        res.status(400).send()
    }
    res.status(401).send()
};
module.exports.logoutUser = async (req, res) => {
    const user = req.user;
    try {
        await user.removeToken(req.token);
        res.status(200).send()

    } catch (e) {
        res.status(400).send(e.message)
    }
};


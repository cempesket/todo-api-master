const User = require('../../model/User');

const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const userId = new ObjectID();

const user = {
    _id: userId,
    email: 'pesket@gmail.com',
    password: '123456',
    tokens: [{access: 'auth', token: jwt.sign({id: userId, access: 'auth'}, 'secret')}]
};
const populate = async () => {
    await User.remove({});
    await new User(user).save()
};
module.exports = {user, populate};
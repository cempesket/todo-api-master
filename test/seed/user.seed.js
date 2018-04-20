const User = require('../../model/User');

const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const user1 = {
    _id: user1Id,
    email: 'pesket@gmail.com',
    password: '123456',
    tokens: [{access: 'auth', token: jwt.sign({id: user1Id, access: 'auth'}, 'secret')}]
};
const user2 = {
    _id: user2Id,
    email: 'anna@gmail.com',
    password: '123456',
    tokens: [{access: 'auth', token: jwt.sign({id: user2Id, access: 'auth'}, 'secret')}]
};
const user = [user1,user2];
const populateUser = async () => {
    await User.remove({});
    await new User(user1).save();
    await new User(user2).save();

};
module.exports = {user, populateUser};
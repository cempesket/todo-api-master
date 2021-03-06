const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {validator: validator.isEmail, message: '{VALUE} is not a valid email'}
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    tokens: [{
        access: {type: String, required: true},
        token: {type: String, required: true}
    }]
});

userSchema.methods.generateToken = async function () {
    let user = this;
    const access = 'auth';
    let token = await jwt.sign({id: user._id, access: access}, 'secret');
    user.tokens = user.tokens.concat({access, token});
    const insertedUser = await user.save();
    return {token, insertedUser};
};
userSchema.methods.removeToken = async function (token) {
    let user = this;
    try {
        await user.update({
            $pull: {
                tokens: {token}
            }
        })
    } catch (e) {
        throw e
    }
};
userSchema.statics.identifyUser = async function (email, password) {
    let User = this;
    try {
        const user = await User.findOne({email: email});
        if (!user)
            return false;
        const isUser = bcrypt.compare(password, user.password);
        if (isUser)
            return user;
    } catch (e) {
        return false
    }
    return false
};
userSchema.statics.findByToken = async function (token) {
    let User = this;
    try {
        const decoded = await jwt.verify(token, 'secret');
        return await User.findOne({
            _id: decoded.id,
            'tokens.token': token,
            'tokens.access': decoded.access
        })
    } catch (e) {
        throw e;
    }
};
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } else {
        next()
    }
    next()
});

const User = mongoose.model('User', userSchema);

module.exports = User;

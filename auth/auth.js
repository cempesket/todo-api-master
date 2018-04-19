const User = require('../model/User');

module.exports.isAuth = async (req, res, next) => {
    const token = req.header('x-auth');
    try {
        const user = await User.findByToken(token);
        if (!user) {
            throw new Error()
        }
        req.user = user;
        req.token = token;
        next()
    } catch (e) {
        res.status(401).send({message: e.message});
    }
};
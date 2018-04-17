const mongoose = require('mongoose');
const config = require('../config/config');


mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.config.db}`).catch(err => console.log(err));

module.exports = {mongoose};




const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.set('useNewUrlParser', true);
mongoose.set('useNewUrlParser', false);


module.exports = {mongoose};

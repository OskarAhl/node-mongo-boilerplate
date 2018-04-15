const mongoose = require('mongoose');

// ================= MONGO CONFIG =========================
// tell mongoose to use JS Promises (i.e. not library)
mongoose.Promise = global.Promise;
// connect server to db (same as MongoClient.connect...)
// no need to setup callback - handled by mongoose.connect
// mongoDB URI -> HEROKU Addons
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose}
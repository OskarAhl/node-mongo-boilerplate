const mongoose = require('mongoose');

// ================= MONGO CONFIG =========================
// tell mongoose to use JS Promises (i.e. not library)
mongoose.Promise = global.Promise;
// connect server to db (same as MongoClient.connect...)
// no need to setup callback - handled by mongoose.connect
mongoose.connect('mongodb://localhost:27017/TodoApp');


// ================= MODEL ===============================
// blueprints for how to store the data
const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        // remove leading/trailing whitespace
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        // regular timestamp
        type: Number,
        default: null
    }
});


// How to make a new Mongoose instance to add to DB
// const newTodo = new Todo({
//     text: 'Drink chocolate milk            '
// });

// newTodo.save().then((doc) => {
//     console.log('saved todo', doc);
// }, (e) => {
//     console.log(e);
// });


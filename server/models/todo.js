const mongoose = require('mongoose');

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
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
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

module.exports = { Todo };
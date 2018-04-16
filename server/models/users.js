const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        //  can only be ONE of the email in the db
        unique: true,
        validate: {
            // return true or false
            validator: validator.isEmail,
            message: `{value} is not a valid email`
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    // array of tokens
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports = { User };
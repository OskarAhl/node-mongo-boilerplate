const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
// Why Schema? Add custom method to generate JWT
const UserSchema = new mongoose.Schema({
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
    }
);

// Why normal function instead of arrow? arrow doesn't bind this keyword
UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'somesecret').toString();

    //  same as push (push some issues with a few mongoDB versions)
    user.tokens.push({
        access,
        token
    });

    // why? so that in server we can chain onto the promise
    return user.save().then(() => {
        return token;
    });
}

var User = mongoose.model('User', UserSchema);

module.exports = { User };
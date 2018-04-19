const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

// ************ Instance Methods ********************
// To only send id and email - other properties e.g. token should be hidden
// determines what will be sent back w/ response
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};
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
};

// ************ Static Methods ********************
// statics -> model method (as opposed instance method) 
UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    // jwt.verify - throws error if anything goes wrong (e.g token value manipulated / wrong secret)
    // +> use try catch
    try {
        decoded = jwt.verify(token, 'somesecret');
    } catch(e) {
        return Promise.reject('not validated');
    }

    return User.findOne({
        '_id': decoded._id,
        // query nested
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;
    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        // verify password
        // bcrypt doesn't support promise so make a new promise
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) { 
                    reject() 
                } else {
                    resolve(user);
                }
            });
        });
    })
};

// *************** Mongoose Middleware *********
// before we save User to DB run this
// call next() when finished
UserSchema.pre('save', function (next) {
    const user = this;

    // only encrypt pw if just modified - e.g. not if only email is updated
    if (user.isModified('password')) {
    // 1: nr of rounds - takes longer -> harder for bruteforce,
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };
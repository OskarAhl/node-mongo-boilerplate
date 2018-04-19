require('./config/config');

const express = require('express');
// middleware - parses HTTP request body -  e.g. JSON or text to JS
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/users');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

// configure middleware - app.use
// can also add custom middleware
app.use(bodyParser.json());

// POST todo
app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET ALL
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos,
            message: 'add custom message here'
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET BY ID
app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    // validate ID
    if (!ObjectId.isValid(id)) {
        return res.status(400).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        } 
        res.send(todo);
    }).catch((e) => {
        // not sending (e) - why? can contain confidential info
        res.status(400).send();
    });
});

//DELETE ONE
app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        } 
        res.send(todo);
    }).catch((e) => {
        res.status(400).send();
    });
});

// PATCH / UPDATE 
app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    // limit JSON to what user can update
    // take text and completed from what user sends
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(id)) {
        return res.status(400).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        // get time returns js timestamp
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

// POST USER
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save().then(() => {
        // res.send(user)
        return user.generateAuthToken();
    }).then((token) => {
        // prefix with x => custom header
        res.header('x-auth', token).send(user);
    }).catch((e) => {
       res.status(400).send(e); 
    });
});

// GET ALL
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
});

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            // send token back to user
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        // error
        res.status(400).send();
    });
});

// Logout
// delete token of currently logged in user
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log('Listening on port ', port);
});

// for test
module.exports = { app };
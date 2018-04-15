const express = require('express');
// middleware - parses HTTP request body -  e.g. JSON or text to JS
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/users');

const app = express();
const port = process.env.port || 3000;

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
    }, (e) => {
        console.log('error');
        // not sending (e) - why? can contain confidential info
        res.status(400).send();
    });
})

app.listen(port, () => {
    console.log('Listening on port ', port);
});

// for test
module.exports = { app };
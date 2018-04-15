const express = require('express');
// middleware - parses HTTP request body -  e.g. JSON or text to JS
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/users');

const app = express();

// configure middleware - app.use
// can also add custom middleware
app.use(bodyParser.json());

// POST route
app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        console.log(e);
        res.status(400).send(e);
    });
});

const port = 3000;
app.listen(port, () => {
    console.log('Listening on port ', port);
})
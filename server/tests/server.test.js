const expect = require('expect');

// use supertest to test endpoints on app
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('./../models/todo');

const todos = [{
    text: 'first todo'
}, {
    text: 'second test todo'
}];

// test lifecycle method
beforeEach((done) => {
    // wipe db
    Todo.remove({}).then(() => {
        // seed db
        Todo.insertMany(todos);
    }).then(() => done());
});

describe('For POST /todos', () => {
    
    it('Should create a new todo', (done) => {
        const text = 'Hellow test';
        let id = '';

        request(app)
            .post('/todos')
            .send({text})
            // make assertions about the request
            .expect(200)
            .expect((res) => {
                id = res.body._id;
                expect(res.body.text).toBe(text);
            })
            // 1: handle errors if error
            .end((err, res) => {
                if (err) { 
                    return done(err);
                }

                // Check db if todo was actually added
                Todo.findById(id).then((todo) => {
                    expect(todo.text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Should not create todo with invalid body data', (done) => {
        const text = '';

        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .end((err, res) => {
                if (err) { return done(err) }
                expect(res.body.todos.length).toBe(2);
                done();
            });
    });
});
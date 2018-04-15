const expect = require('expect');

// use supertest to test endpoints on app
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('./../models/todo');

// test lifecycle method

beforeEach((done) => {
    // wipe db
    Todo.remove({}).then(() => done());
});

describe('For POST /todos', () => {
    
    it('Should create a new todo', (done) => {
        const text = 'Hellow test';

        request(app)
            .post('/todos')
            .send({text})
            // make assertions about the request
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            // 1: handle errors if error
            .end((err, res) => {
                if (err) { 
                    return done(err);
                }

                // Check db if todo was actually added
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
});
const expect = require('expect');

// use supertest to test endpoints on app
const request = require('supertest');
const { ObjectId } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('./../models/todo');

const todos = [{
    text: 'first todo',
    _id: new ObjectId()
}, {
    text: 'second test todo',
    completed: true,
    completedAt: 333,
    _id: new ObjectId()
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
    
    // done for async tests
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

describe('GET /TODOS/:id', () => {
    it('should get by id', (done) => {
        const id = todos[0]._id.toHexString();
        const text = todos[0].text;
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) { return done(err) }

                expect(res.body._id).toBe(id);
                done();
            });
    });

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectId().toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done)
    });

    it('should return 400 if bad id', (done) => {
        const id = '123abc';

        request(app)
            .get(`/todos/${id}`)
            .expect(400)
            .end(done)
    });
});

describe('DELETE /TODOS/:id', () => {
    it('should get by id', (done) => {
        const id = todos[0]._id.toHexString();
        const text = todos[0].text;
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) { return done(err) }
                expect(res.body._id).toBe(id);
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectId().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    });

    it('should return 400 if bad id', (done) => {
        const id = '123abc';

        request(app)
            .delete(`/todos/${id}`)
            .expect(400)
            .end(done)
    });
});

describe('PATCH /TODOS/:id', () => {
    it('should update by id', (done) => {
        const id = todos[0]._id.toHexString();
        const text = 'new text here';
        
        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
            })
            .end(done)
    });

    it('should clear completedAt when todo is not completed', (done) => {
        const id = todos[0]._id.toHexString();
        const text = 'new text here';

        request(app)
        .patch(`/todos/${id}`)
        .send({
            completed: false,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done)
    });
});
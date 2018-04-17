const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('../../server');
const Todo = require('../../model/Todo');

const todo = {text: 'Something to do', _id: new ObjectID()};

beforeEach(async () => {
    await Todo.remove({});
    const newTodo = new Todo(todo);
    await newTodo.save()
});

describe('POST: /todos', () => {

    it('should save new todo to the database and get it as response', (done) => {

        const testTodo = {text: 'things to do'};

        request(app)
            .post('/api/todos')
            .send(testTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.text).toEqual(testTodo.text);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                Todo.count()
                    .then(count => {
                        expect(count).toBe(2);
                        return done();
                    })
                    .catch(err => {
                        return done(err)
                    });
            })
    });
    it('should return 400 error if you send request without text', (done) => {
        const testTodo = {};
        request(app)
            .post('/api/todos')
            .send(testTodo)
            .expect(400)
            .expect(res => {
                expect(res.body.text).toEqual(testTodo.text);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                Todo.count()
                    .then(count => {
                        expect(count).toBe(1);
                        return done();
                    })
                    .catch(err => {
                        return done(err)
                    });
            })
    });
});

describe('GET: /todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/api/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body[0].text).toEqual('Something to do');
            })
            .end(err => {
                if (err) {
                    done(err);
                } else {
                    done()
                }
            })
    });

    it('should get a todo by id while id is valid and it exists', (done) => {
        const id = todo._id.toHexString(); // it is a valid id
        request(app)
            .get(`/api/todos/${id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.text).toEqual('Something to do')
            })
            .end(err => {
                !!err ? done(err) : done()
            })
    });
    it('should return 404 if todo not found', (done) => {
        const id = '5ad5bffffaf2952ce8ad1f1e'; // it is a valid id
        request(app)
            .get(`/api/todos/${id}`)
            .expect(404)
            .end(err => {
                !!err ? done(err) : done()
            })
    });
    it('should return 400 if id is not valid', (done) => {
        const id = '5ad5bffffaf2952ce8ad1f1'; // it is an invalid id
        request(app)
            .get(`/api/todos/${id}`)
            .expect(400)
            .end(err => {
                !!err ? done(err) : done()
            })
    });

});

describe('DELETE /todos/delete', () => {
    it('should delete the todo with the given id', (done) => {
        const id = todo._id.toHexString();
        request(app)
            .delete(`/api/todos/delete/${id}`)
            .expect(200)
            .expect(async(res) => {
                expect(res.body._id).toEqual(id);
                const count =await Todo.count();
                expect(count).toBe(0)
            })
            .end(err => {
                !!err ? done(err) : done()
            })
    });
    it('should return 404 if todo not found', (done) => {
        const id = '5ad5bffffaf2952ce8ad1f1e'; // it is a valid id
        request(app)
            .delete(`/api/todos/delete/${id}`)
            .expect(404)
            .end(err => {
                !!err ? done(err) : done()
            })
    });
    it('should return 400 if id is not valid', (done) => {
        const id = '5ad5bffffaf2952ce8a'; // it is an invalid id
        request(app)
            .delete(`/api/todos/delete/${id}`)
            .expect(400)
            .end(err => {
                !!err ? done(err) : done()
            })
    });
});




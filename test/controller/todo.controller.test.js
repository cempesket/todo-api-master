const expect = require('expect');
const request = require('supertest');

const app = require('../../server');
const Todo = require('../../model/Todo');
const {id,todo, populate} = require('../seed/todo.seed');
const {user, populateUser} = require('../seed/user.seed');

beforeEach(populateUser);
beforeEach(populate);

describe('POST: /todos', () => {

    it('should save new todo to the database and get it as response', (done) => {

        const testTodo = {text: 'things to do'};

        request(app)
            .post('/api/todos')
            .set('x-auth',user[0].tokens[0].token)
            .send(testTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.text).toEqual(testTodo.text);
            })
            .end(done)
    });
    it('should return 400 error if you send request without text', (done) => {
        const testTodo = {};
        request(app)
            .post('/api/todos')
            .set('x-auth',user[0].tokens[0].token)
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
            .set('x-auth',user[0].tokens[0].token)
            .expect(200)
            .end(done)
    });

    it('should get a todo by id while id is valid and it exists', (done) => {
         request(app)
            .get(`/api/todos/${id}`)
            .set('x-auth',user[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.text).toEqual('Something to do')
            })
            .end(done)
    });
    it('should return 404 if todo not found', (done) => {
        const id = '5ad5bffffaf2952ce8ad1f1e'; // it is a valid id
        request(app)
            .get(`/api/todos/${id}`)
            .set('x-auth',user[0].tokens[0].token)
            .expect(404)
            .end(done)
    });
    it('should return 400 if id is not valid', (done) => {
        const id = '5ad5bffffaf2952ce8ad1f1'; // it is an invalid id
        request(app)
            .get(`/api/todos/${id}`)
            .set('x-auth',user[0].tokens[0].token)
            .expect(400)
            .end(done)
    });
    it('should return 404 if user does not have the todo', (done) => {
        const id = todo._id.toHexString();
        request(app)
            .get(`/api/todos/${id}`)
            .set('x-auth',user[1].tokens[0].token)
            .expect(404)
            .end(done)
    });

});

describe('DELETE /todos/delete', () => {
    it('should delete the todo with the given id', (done) => {
        const id = todo._id.toHexString();
        request(app)
            .delete(`/api/todos/delete/${id}`)
            .set('x-auth',user[0].tokens[0].token)
            .expect(200)
            .expect(async (res) => {
                expect(res.body._id).toEqual(id);
                const count = await Todo.count();
                expect(count).toBe(0)
            })
            .end(done)
    });
    it('should return 404 if todo not found', (done) => {
        const id = '5ad5bffffaf2952ce8ad1f1e'; // it is a valid id
        request(app)
            .delete(`/api/todos/delete/${id}`)
            .set('x-auth',user[0].tokens[0].token)
            .expect(404)
            .end(done)
    });
    it('should return 400 if id is not valid', (done) => {
        const id = '5ad5bffffaf2952ce8a'; // it is an invalid id
        request(app)
            .delete(`/api/todos/delete/${id}`)
            .set('x-auth',user[0].tokens[0].token)
            .expect(400)
            .end(done)
    });
});

describe('PATCH /todos/update', () => {
    it('should update the todo with given id', (done) => {
        const id = todo._id.toHexString();
        const testUpdatedTodo = {completed: true};
        request(app)
            .patch(`/api/todos/update/${id}`)
            .set('x-auth',user[0].tokens[0].token)
            .send(testUpdatedTodo)
            .expect(200)
            .expect(async (res) => {
                expect(res.body._id).toEqual(id);
                const updatedTodo = await Todo.findById(id);
                if (updatedTodo)
                    expect(updatedTodo.completed).toBe(true)
            })
            .end(done)
    });
});




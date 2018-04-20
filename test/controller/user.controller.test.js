const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = require('../../server');
const User = require('../../model/User');
const {ObjectID} = require('mongodb');
const {user, populateUser} = require('../seed/user.seed');

beforeEach(populateUser);

describe('POST /user', () => {
    it('should save user, return status 200 as response and hash the password', (done) => {
        const user = {email: 'pesketcem@gmail.com', password: '123456'};
        request(app)
            .post('/api/user')
            .send(user)
            .expect(200)
            .expect(async (res) => {
                expect(res.body.status).toBe(200);
                const decoded = await jwt.decode(res.headers['x-auth']);
                expect(decoded.id).toEqual(res.body.user._id);
                const foundUser = await User.findOne({email: user.email});

                expect(await bcrypt.compare(user.password, foundUser.password)).toBe(true)
            })
            .end(done)
    });
    it('should return status 400 as response and not save the user if email exists', (done) => {
        const user = {email: 'pesket@gmail.com', password: '123456'};
        request(app)
            .post('/api/user')
            .send(user)
            .expect(400)
            .expect(async () => {
                const count = await User.count();
                expect(count).toBe(2);
            })
            .end(done)
    });
    it('should return status 400 as response and not save the user and return validation error if request is invalid', (done) => {
        const user = {};
        request(app)
            .post('/api/user')
            .send(user)
            .expect(400)
            .expect(async (res) => {
                const count = await User.count();
                expect(count).toBe(2);
                expect(res.body.message).toEqual('User validation failed: password: Path `password` is required., email: Path `email` is required.')
            })
            .end(done)
    });

});

describe('GET /user/me', () => {
    it('should get user with token in header', (done) => {

        request(app)
            .get('/api/user/me')
            .set('x-auth', user[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toEqual(user[0].email)
            })
            .end(done)
    });
    it('should return 401 with no token in header', (done) => {

        request(app)
            .get('/api/user/me')
            .expect(401)
            .end(done)
    });

});
describe('POST /user/me/login', () => {
    it('should login user and send token in header', (done) => {
        const dummyUser = {email: 'pesket@gmail.com', password: '123456'};
        request(app)
            .post('/api/user/me/login')
            .send(dummyUser)
            .expect(200)
            .expect(async (res) => {
                const token = res.headers['x-auth'];
                const decoded = await jwt.verify(token, 'secret');
                const foundUser = await User.findOne({email: dummyUser.email});
                expect(foundUser._id.toHexString()).toEqual(decoded.id)
            })
            .end(done)
    });
    it('should not login user and not send token in header if email does not exist', (done) => {
        const user = {email: 'pesket@gmail.co', password: '123456'};
        request(app)
            .post('/api/user/me/login')
            .send(user)
            .expect(401)
            .end(done)
    });
    it('should not login user and not send token in header if request is invalid', (done) => {
        const user = {};
        request(app)
            .post('/api/user/me/login')
            .send(user)
            .expect(401)
            .end(done)
    });

});
describe('DELETE /user/me/logout', () => {
    it('should logout user and delete the token', (done) => {
        const token = user[0].tokens[0].token;
        request(app)
            .delete('/api/user/me/logout')
            .set('x-auth', token)
            .expect(200)
            .expect(async() => {
                const foundUsr = await User.findOne({email:user[0].email});
                expect(foundUsr.tokens.length).toBe(0)
            })
            .end(done)
    });
    it('should not logout user and not delete the token if not auth', (done) => {
        request(app)
            .delete('/api/user/me/logout')
            .expect(401)
            .end(done)
    });
});

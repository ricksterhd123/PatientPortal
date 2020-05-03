process.env.DEBUG = true;   // Set true for debugging || testing

const app = require('../app');
const assert = require('assert');
const request = require('supertest');
const {describe, it} = require("mocha");
const username = 'test';
const password = 'password';

describe('Checking if authentication works', function() {
    //const agent = request.agent(app);
    it('User can register', async function() {
        try {
            const response = await request(app)
                .post('/api/register')
                .send({ username: username, password: password })
                .set('Accept', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200);
            assert.strictEqual(response.body.success, true);
            assert.strictEqual(response.body.error, null);
        }
        catch (err) {
            assert.strictEqual(err, null);
        }
    });

    it('User can login', async function() {
        try {
            const response = await request(app)
                .post('/api/login')
                .set("Authorization", "Basic " + Buffer.from(username + ":" + password).toString('base64'))
                .set('Accept', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200);
            assert.strictEqual(response.body.success, true);
            assert.strictEqual(response.body.error, null);
        }
        catch (err) {
            assert.strictEqual(err, null);
        }
    });

    
});

// TODO
// describe('Checking if messages work', function() {
//     const agent = request.agent(app);
//     it('Can send message', async function)
// });
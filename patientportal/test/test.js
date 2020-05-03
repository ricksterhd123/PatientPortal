process.env.TEST = true;    // Set true when testing
process.env.DEBUG = true;   // Set true for testing || debugging

const app = require('../server');
const assert = require('assert');
const request = require('supertest');
const {describe, it} = require("mocha");

/**
 * Test POST /api/login
 */
describe('Checking if authentication works', function() {
    const username = "test";
    const password = "password";
    const agent = request.agent(app);

    it('User can register', function() {
        return agent
        .post('/api/register')
        .send({username: username, password: password})
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .then(response => {
            assert.strictEqual(response.body.success, true);
            assert.strictEqual(response.body.error, null);
        })
        .catch(err => {
            assert.strictEqual(err, null);
        });
    });

    it('User can login', function() {
        return agent
        .post('/api/login')
        .set("Authorization", "Basic " + Buffer.from(username+":"+password).toString('base64'))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .then(response => {
            assert.strictEqual(response.body.success, true);
            assert.strictEqual(response.body.error, null);
        })
        .catch(err => {
            assert.strictEqual(err, null);
        });
    });
});

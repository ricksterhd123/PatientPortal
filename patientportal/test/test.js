process.env.TEST = true;
const app = require('../server');
const assert = require('assert');
const request = require('supertest');
const {describe, it} = require("mocha");
const username = "test";
const password = "password";


describe('POST /api/register', function() {
    it('responds with json', function(done) {
        return request(app)
        .post('/api/register')
        .send({username: "test", password: "password"})
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .then(response => {
            assert.strictEqual(response.body.success, true);
            assert.strictEqual(response.body.error, null);
        })
        .catch(err => {
            assert.strictEqual(err, null);
        })
    })
});

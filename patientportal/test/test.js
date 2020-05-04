process.env.DEBUG = true;   // Set true for debugging || testing

const app = require('../app');
const roles = require('../libs/roles');
const assert = require('assert');
const request = require('supertest');
const {describe, it} = require("mocha");
let accounts = {
    patient: {
        username: 'patient',
        password: 'password'
    },
    clinician: {
        username: 'clinician',
        password: 'password'
    },
    Admin: {
        username: 'admin',
        password: 'password'
    }
};

describe('Checking if authentication works', function() {
    it('User can register', async function() {
        try {
            const response = await request(app)
                .post('/api/register')
                .send({ username: accounts.admin.username, password: accounts.admin.password })
                .set('Accept', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200);
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
                .set("Authorization", "Basic " + Buffer.from(accounts.admin.username + ":" + accounts.admin.password).toString('base64'))
                .set('Accept', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200);
            assert.strictEqual(response.body.error, null);
        }
        catch (err) {
            assert.strictEqual(err, null);
        }
    });


    it('First user registered is admin', async function() {
        try {
            const response = await request(app)
                .post('/api/login')
                .set("Authorization", "Basic " + Buffer.from(accounts.admin.username + ":" + accounts.admin.password).toString('base64'))
                .set('Accept', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200);
            assert.strictEqual(response.body.result.username, accounts.admin.username);
            assert.strictEqual(response.body.result.role, roles.ADMIN);
            assert.strictEqual(response.body.error, null);
        }
        catch (err) {
            assert.strictEqual(err, null);
        }
    });

    it('Second user registered is a patient', async function() {
        try {
            const response = await request(app)
                .post('/api/register')
                .send({ username: accounts.patient.username, password: accounts.patient.password })
                .set('Accept', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200);
            assert.strictEqual(response.body.result.username, accounts.patient.username);
            assert.strictEqual(response.body.result.role, roles.USER);  // todo rename to roles.PATIENT
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
//     it('User can send message', function () {

//     });
// });
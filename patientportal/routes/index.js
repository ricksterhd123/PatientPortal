let api = {};
api.login = require('./api/authentication/login');
api.register = require('./api/authentication/register');
api.logout = require('./api/authentication/logout');

module.exports = {api};

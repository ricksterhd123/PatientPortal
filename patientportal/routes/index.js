let api = {};
api.login = require('./api/login');
api.register = require('./api/register');
api.logout = require('./api/logout');

module.exports = {api};

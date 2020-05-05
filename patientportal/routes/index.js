let api = {};
api.login = require('./api/authentication/login');
api.register = require('./api/authentication/register');
api.logout = require('./api/authentication/logout');

let views = {};
views.index = require('./views/home');
views.login = require('./views/login');
views.register = require('./views/register');
views.appointments = require('./views/appointments');
views.messages = require('./views/messages');
views.symptoms = require('./views/symptoms');
views.settings = require('./views/settings');
module.exports = {api, views};

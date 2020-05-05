let api = {};
api.auth = {}
api.auth.login = require('./api/authentication/login');
api.auth.register = require('./api/authentication/register');
api.auth.logout = require('./api/authentication/logout');
api.messages = {};
api.messages.contacts = require('./api/message/contacts');

let views = {};
views.index = require('./views/home');
views.login = require('./views/login');
views.register = require('./views/register');
views.appointments = require('./views/appointments');
views.messages = require('./views/messages');
views.symptoms = require('./views/symptoms');
views.settings = require('./views/settings');
module.exports = {api, views};

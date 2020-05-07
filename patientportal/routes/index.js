let api = {};
api.auth = {}
api.auth.login = require('./api/authentication/login');
api.auth.register = require('./api/authentication/register');
api.auth.logout = require('./api/authentication/logout');
api.messages = {};
api.messages.from = require('./api/messages/from');
api.messages.contacts = require('./api/messages/contacts');
api.messages.send = require('./api/messages/send');
api.appointments = {};
api.appointments.create = require('./api/appointments/create');
api.appointments.cancel = require('./api/appointments/cancel');
api.appointments.slots = require('./api/appointments/slots');
api.appointments.schedule = require('./api/appointments/schedule');
api.appointments.update = require('./api/appointments/update');
// get all available clinicians
api.appointments.clinicians = require('./api/appointments/clinicians');

let views = {};
views.index = require('./views/home');
views.login = require('./views/login');
views.register = require('./views/register');
views.appointments = require('./views/appointments');
views.messages = require('./views/messages');
views.symptoms = require('./views/symptoms');
views.settings = require('./views/settings');
module.exports = {api, views};

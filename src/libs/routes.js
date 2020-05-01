const userModel = require('./models/user');
// Routes which render views
const routes = {};

// req.isAuthenticated is provided from the auth router
routes.index = async function (req, res) {
  let token = req.token;
  var user = new userModel.User(null, token.username);

  user = await userModel.getUser(user).catch((err) => {
    console.error(err);
    res.status(401).send("Error: could not get user with token");
  });

  res.render('home.pug', { title: "Home", name: token.username, role: user.options.role });
};

routes.register = function (req, res) {
  let token = req.token;
  if (token) {
    res.redirect('/');
  } else {
    res.render('register.pug', { title: 'register' });
  }
};

routes.login = function (req, res) {
  res.render('login.pug', { title: 'login' });
};

routes.appointments = function (req, res) {
  res.render('appointments.pug');
};

routes.contact = function (req, res) {
  res.render('contact.pug');
};

routes.symptoms = function (req, res) {
  res.render("symptoms.pug");
};

routes.settings = function (req, res) {
  res.render("settings.pug");
};

// Bind each route to a callback function
const r = {
  "/": routes.index,
  "/login": routes.login,
  "/register": routes.register,
  "/appointments": routes.appointments,
  "/contact": routes.contact,
  "/symptoms": routes.symptoms,
  "/settings": routes.settings
};

module.exports = r;
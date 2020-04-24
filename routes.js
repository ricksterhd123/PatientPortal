let routes = {};

// req.isAuthenticated is provided from the auth router
routes.index = function (req, res) {
    res.send('Hello ' + JSON.stringify(req.session));
    //res.render("home.html", {name: 'test'});
}

routes.appointments = function (req, res) { 
    res.render('appointments.html');
}

routes.contact = function (req, res) {
    res.render('contact.html');
}

routes.symptoms = function (req, res) {
    res.render("symptoms.html");
}

routes.settings = function (req, res) {
    res.render("settings.html");
}

// Not sure exactly what this does yet...
routes.callback = function (req, res) {
    res.redirect("/home");
    console.log(req);
}

module.exports = routes;
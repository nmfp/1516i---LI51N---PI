
'use strict';

const reqPingDB = require('../middlewares/database/pingdb');
const userHandler = require('../middlewares/users/usersHandler');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const request = require('request');

const db_base_url = "http://localhost:5984/";
const db_name = "userlogin";
const db_url = db_base_url+db_name;

//register middlewares that will create the property user in req object
passport.use(new LocalStrategy(function (username, password, done) {
    userHandler.getOne(username, function (err, user) {
        if (err)
            done(err);
        const u = user;
        if (!u)
            return done(false, 'Username invalid!');
        if (u.password != password)
            return done(false, 'Password invalid!');
        return done(null, u);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    userHandler.getOne(id, function(err, user) {
        if (err)
            return done(err);

        return done(null, user.username);
    });
});

module.exports = function(app) {

    app.get('/user/login', function(req, res) {
        return res.redirect('/favorites/all');
    });

    app.post('/user/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/user/register',
            failureFlash: false })
    );

    app.get('/user/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/user/register', function(req, res) {
        res.render('usersView/registerView', { user: req.user });
    });

    //saving a new user in the database
    app.post('/user/register', function(req, res, next) {
        const userObj = {"user" :{
            "username": req.body.username,
            "password": req.body.password,
            "email": req.body.email
        }, "idUser": req.body.username};

        request.post({
            uri: db_url,
            body: userObj,
            json: true
        }, function(err, resp, body) {
            if (err)
                return next(err);
            return res.render('usersView/loginView', { user: req.user });
        });
    });

    //ping the user document in the database
    app.get('/user/pingdb', reqPingDB.checkDatabase, reqPingDB.createDatabase, reqPingDB.createView,
    function(req, res) { res.end(); });

};

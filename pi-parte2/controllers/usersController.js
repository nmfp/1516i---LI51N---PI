
'use strict';
/*
const db_name = "userlogin";
const db_url = "http://localhost:5984/"+db_name;

const userHandler = require('./middlewares/users/usersHandler');

const request = require('request');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;*/
/*
//TODO done
passport.use(new LocalStrategy(function (username, password, done)  {
    userHandler.getOne(username, function (err, user) {
        if (err)
            return done(err);
        const u = user;
        if (!u)
            return done(null, false, 'Username invalid!');
        if(u.password != password)
            return done(null, false, 'Passowrd invalid!');
        return done(null, u);
    });
}));

//TODO done
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    userHandler.getOne(id, function(err, user) {
        if (err)
            return done(err);

        return done(null, user);
    });
});*/

//enviar a view programaticamente como se fosse um documento

module.exports = function(app) {
/*
    //TODO testar
    app.use(function(req, res, next) {
        res.locals.user = req.user || {};
        console.log(req.user);
        next();
    });

    //TODO melhorar
    app.get('/user/pingdb',
        function(req, res, next) {
            request(
                {uri: db_url, method: 'GET'},
                function (err, response, body) {
                    if (err)
                        return next(err);
                    if (response.statusCode !== 201){
                        request(
                            {uri: db_url, method: 'PUT'},
                            function (err, response, body) {
                                if (err)
                                    return next(err);
                                if (response.statusCode === 200)
                                    console.log(db_name+" is up!");
                            }
                        );
                    }
                }
            );
        });

    app.get('/user/login', function(req, res) {
        return res.render('usersView/page')
    });

    app.post('/login', passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
*/
};

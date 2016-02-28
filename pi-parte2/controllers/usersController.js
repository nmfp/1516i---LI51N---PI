
'use strict';

const express = require('express');
const router = express.Router();

const db_name = "userlogin";
const db_url = "http://localhost:5984/"+db_name;

const request = require('request');
const passport = require('passport');

router.get('/pingdb',
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


router.get('/login', function(req, res) {

});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res)  {
        res.redirect('/tasks');
}) ;

module.exports = router;

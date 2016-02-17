
'use strict';

const express = require('express');
const router = express.Router();

const db_name = "userlogin";
const db_url = "http://localhost:5984/"+db_name;

const request = require('request');
const passport = require('passport');

request(
    {uri: db_url, method: 'PUT'},
    function (err, response, body) {
        if (err)
            throw err;
        if (response.statusCode === 201)
            console.log(body);
        if (response.statusCode !== 201)
            console.log(body);
    }
);

router.get('/login', function(req, res) {

});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res)  {
        res.redirect('/tasks');
}) ;

module.exports = router;

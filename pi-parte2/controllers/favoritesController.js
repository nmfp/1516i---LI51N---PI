
'use strict';

const express = require('express');
const router = express.Router();

const reqDBMapper = require('../middlewares/database/databaseMapper');
const reqDBParser = require('../middlewares/database/databaseRequest');

const couchdb = require('node-couchdb');
const request = require("request");

let teams = [];



/*couchdb.del("tasks", function (err, resData) {
    if (err)
        return console.error(err);

    console.dir(resData);
});*/

request(
    {uri: 'http://localhost:5984/footballdata', method: 'PUT'},
    function (err, response, body) {
        if (err)
            throw err;
        if (response.statusCode === 201)
            console.log(body);
        if (response.statusCode !== 201)
            console.log(body);
    }
);

router.post('/insertGroup',function(req,res) {
    let group = {
        "group": req.body.groupName,
        "teams": []
    };
    request.post({
        url: "http://localhost:5984/footballdata",
        body: group,
        json: true,
    }, function (err, resp, body) {
        if (err) return new Error(err);
        res.redirect("/favorites/all")
    });
});


router.post('/insertTeam', function(req, res) {

    let favoriteTeam = {
        "idL":req.body.idL,
        "idT":req.body.idT
    };

    request({
        url: "http://localhost:5984/footballdata",
        json: true,
    }, function(err, resp, body) {
        if (err) return new Error(err);

        res.redirect("/favorites/all")
    });
});

router.get('/all', reqDBParser.requestDB, reqDBParser.requestTeamDB, reqDBMapper.mapperTeamsFav,
function(req, res) {
    req.models = req.models || {};
    let teams = req.models.teams;
    let leagues = req.models.favouritesLeagueTeams;
    let i = 0;
    for (let j = 0; j < leagues.length; j++) {
        let id = leagues[j];
        teams[i++]["idL"] = id;
    }

    teams = req.models.teams;
    res.render('leaguesView/favoritesController', { title: 'Teams info', leagues:leagues, teams: teams });
});

module.exports = router;

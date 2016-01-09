
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
    {uri: 'http://localhost:5984/tasks', method: 'PUT'},
    function (err, response, body) {
        if (err)
            throw err;
        if (response.statusCode === 201)
            console.log(body);
        if (response.statusCode !== 201)
            console.log(body);
    }
);

router.post('/insertTeam', function(req, res) {

    let favoriteTeam = {
        "teamidL":req.body.idL,
        "teamidT":req.body.idT
    };

    request.post({
        url: "http://localhost:5984/footballdata",
        body: favoriteTeam,
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

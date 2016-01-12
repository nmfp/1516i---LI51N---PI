
'use strict';

const express = require('express');
const router = express.Router();

const reqDBMapper = require('../middlewares/database/databaseMapper');
const reqDBParser = require('../middlewares/database/databaseRequest');

const couchdb = require('node-couchdb');
const request = require("request");

let groups= [];
let teams = [];

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
        json: true
    }, function (err, resp, body) {
        if (err) return new Error(err);
        res.redirect("/favorites/all");
    });
});

router.post('/insertTeam', reqDBParser.requestDB, reqDBParser.requestFavoritesName, function(req, res) {
    let favoriteTeam = {
        "idL": req.body.idL,
        "idT": req.body.idT
    };
    req.models = req.models || {};

    let dbObjs = req.models.favoriteNames;
    let groupObj = {};
    for (let i = 0; i < dbObjs.length; ++i) {
        if (dbObjs[i]["name"] == req.body.favoriteName) {
            groupObj = dbObjs[i];
            break;
        }
    }

    groupObj["dbObj"]["teams"].push(favoriteTeam);
    let header = {
        _id: groupObj["dbObj"]["_id"],
        _rev: groupObj["dbObj"]["_rev"],
        group: groupObj["name"],
        teams: groupObj["dbObj"]["teams"]
    };

    couchdb.update("footballdata", header, function(err, resData) {
        if (err)
            console.log(err);

        return res.redirect("/favorites/all");
    });
});

router.get('/all', reqDBParser.requestDBGroups,reqDBParser.requestNameGroup,
    function(req, res) {
        req.models = req.models || {};
        groups = req.models.groupsName;
        res.render('leaguesView/group', {  groups: groups});
    });


router.get('/:idGroup/teams', reqDBParser.teamsOfGroups, reqDBParser.reqTeamsGroup, reqDBMapper.mapperTeamsFav,
    function(req, res) {

        req.models = req.models || {};
        let teams = req.models.teams;
        let groupName = req.params.idGroup;
        let leagues = req.models.favouritesLeagueTeams;
        let i = 0;
        for (let j = 0; j < leagues.length; j++) {
            let id = leagues[j];
            teams[i++]["idL"] = id;
        }

        teams = req.models.teams;
        res.render('leaguesView/favoritesTeams', {groupName:groupName,leagues:leagues, teams: teams });
    });

/*
router.get('/all', reqDBParser.requestDB, reqDBParser.requestTeamDB, reqDBMapper.mapperTeamsFav,
function(req, res) {
    req.models = req.models || {};
    let teams = req.models.teams;
    let leagues = req.models.favouritesLeagueTeams;
    let i = 0;
    for (let j = 0; j < leagues.length; j++) {
        let id = leagues[j];
    let header = {
        _id: groupObj["dbObj"]["_id"],
        _rev: groupObj["dbObj"]["_rev"],
        group: groupObj["name"],
        teams: groupObj["dbObj"]["teams"]
    };
    teams = req.models.teams;
    res.render('leaguesView/favoritesController', { title: 'Teams info', leagues:leagues, teams: teams });
            return console.error(err);

        console.dir(resData);
        return res.redirect("/favorites/all")
});
})
module.exports = router;

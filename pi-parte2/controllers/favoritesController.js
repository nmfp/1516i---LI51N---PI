
'use strict';

const express = require('express');
const router = express.Router();

const reqDBMapper = require('../middlewares/database/databaseMapper');
const reqDBParser = require('../middlewares/database/databaseRequest');

const reqFavorites = require('../middlewares/api_favorites/favoritesRequest');

const reqMapper = require('../middlewares/api/ApiMapper');

const couchdb = require('node-couchdb');
const request = require("request");

let groups = [];
let teams = [];

const db_name = "footballdata";
const db_url = "http://localhost:5984/"+db_name;

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

router.post('/insertGroup',function(req, res) {
    let group = {
        "group": req.body.groupName,
        "teams": []
    };
    request.post({
        url: db_url,
        body: group,
        json: true
    }, function (err, resp, body) {
        if (err)
            console.log(err.message);

        let urRet = req.body.groupName+"/teams";
        res.redirect(urRet);
    });
});

router.post('/insertTeam', reqDBParser.requestDB, reqDBParser.requestFavoritesName,
    function(req, res) {
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

        couchdb.update(db_name, header, function(err, resData) {
            if (err)
                console.log(err.message);
            let urRet = req.body.favoriteName+"/teams";
            return res.redirect(urRet);
        });
    });

router.post('/deleteGroup', reqDBParser.requestDB, reqDBParser.requestFavoritesName,
    function(req, res) {
        req.models = req.models || {};

        let dbObjs = req.models.favoriteNames;
        let groupObj = {};
        for (let i = 0; i < dbObjs.length; ++i) {
            if (dbObjs[i]["name"] == req.body.favoriteName) {
                groupObj = dbObjs[i];
                break;
            }
        }

        let id = groupObj["dbObj"]["_id"];
        let rev = groupObj["dbObj"]["_rev"];

        couchdb.del(db_name, id, rev, function(err, resData) {
            if (err)
                console.log(err.message);

            return res.redirect("/favorites/all");
        });
    });

router.get('/all', reqDBParser.requestDBGroups,reqDBParser.requestNameGroup,
    function(req, res) {
        req.models = req.models || {};
        groups = req.models.groupsName;

        res.render('favoritesView/group', { groups: groups });
    });

router.post('/changeT/:idL', reqFavorites.requestAPI, reqMapper.mapperTeams,
    function(req, res) {
        let teams = req.models.teams;

        res.send(teams);
});

router.post('/addT/:groupN/:idL/:idT', reqDBParser.requestDB, reqDBParser.requestFavoritesName, reqFavorites.requestAPI, reqMapper.mapperTeams,
    function(req, res) {
        let favoriteTeam = {
            "idL": req.params.idL,
            "idT": req.params.idT
        };
        req.models = req.models || {};

        let dbObjs = req.models.favoriteNames;
        let groupObj = {};
        for (let i = 0; i < dbObjs.length; ++i) {
            if (dbObjs[i]["name"] == req.params.groupN) {
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

        couchdb.update("db_name", header, function(err, resData) {
            if (err)
                console.log(err.message);
        });
        let teams = req.models.teams;
        let idT = req.params.idT;
        let team = {};
        for (let i = 0; i < teams.length; ++i) {
            if (teams[i]["id"] === idT) {
                team = teams[i];
                break;
            }
        }
        res.send(team);
    });

router.get('/:idGroup/teams', reqDBParser.teamsOfGroups, reqDBParser.reqTeamsGroup, reqDBMapper.mapperTeamsFav,
    reqFavorites.requestAPI, reqMapper.mapperLeagues,
    function(req, res) {

        req.models = req.models || {};
        let teams = req.models.teams;
        let groupName = req.params.idGroup;
        let leagues = req.models.favouritesLeagueTeams;
        let i = 0;
        let control = false;
        let leaguesAll = req.models.leagues;
        if (leagues !== undefined) {
            for (let j = 0; j < leagues.length; j++) {
                let id = leagues[j];
                teams[i++]["idL"] = id;
            }
        } else {
            control = true;
        }

        res.render('favoritesView/favoritesTeams', { groupName: groupName, leagues:leagues, teams: teams, leaguesA: leaguesAll, control: control });
    });

module.exports = router;


'use strict';

const express = require('express');
const router = express.Router();

const reqDBMapper = require('../middlewares/database/databaseMapper');
const reqDBParser = require('../middlewares/database/databaseRequest');
const reqPingDB = require('../middlewares/database/pingdb');

const reqFavorites = require('../middlewares/api_favorites/favoritesRequest');

const reqMapper = require('../middlewares/api/ApiMapper');

const couchdb = require('node-couchdb');
const request = require("request");

let groups = [];
let teams = [];

const db_name = "footballdata";
const db_url = "http://localhost:5984/"+db_name;

//create database
router.get('/pingdb', reqPingDB.checkDatabase, reqPingDB.createDatabase, reqPingDB.createView,
    function(req, res) {  });

router.post('/insertGroup',function(req, res, next) {
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
            return next(err);

        let urRet = req.body.groupName+"/teams";
        res.redirect(urRet);
    });
});

router.post('/insertTeam', reqDBParser.requestDB, reqDBParser.requestFavoritesName,
    function(req, res, next) {
        let favoriteTeam = {
            "idL": req.body.idL,
            "idT": req.body.idT
        };
        req.models = req.models || {};

        let dbObjs = req.models.favoriteNames;
        let groupObj = dbObjs.find(function (dbo) {
            if (dbo["name"] == req.body.favoriteName)
                return dbo;
        });

        groupObj["dbObj"]["teams"].push(favoriteTeam);
        let header = {
            _id: groupObj["dbObj"]["_id"],
            _rev: groupObj["dbObj"]["_rev"],
            group: groupObj["name"],
            teams: groupObj["dbObj"]["teams"]
        };

        couchdb.update(db_name, header, function(err, resData) {
            if (err)
                return next(err);
            let urRet = req.body.favoriteName+"/teams";
            return res.redirect(urRet);
        });
    });

router.post('/deleteGroup', reqDBParser.requestDB, reqDBParser.requestFavoritesName,
    function(req, res, next) {
        req.models = req.models || {};

        let dbObjs = req.models.favoriteNames;
        let groupObj = dbObjs.find(function (dbo) {
            if (dbo["name"] == req.body.favoriteName)
                return dbo;
        });

        let id = groupObj["dbObj"]["_id"];
        let rev = groupObj["dbObj"]["_rev"];

        couchdb.del(db_name, id, rev, function(err, resData) {
            if (err)
                return next(err);

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

        res.send(req.models.teams);
});

router.post('/addT/:groupN/:idL/:idT', reqDBParser.requestDB, reqDBParser.requestFavoritesName, reqFavorites.requestAPI, reqMapper.mapperTeams,
    function(req, res, next) {
        let favoriteTeam = {
            "idL": req.params.idL,
            "idT": req.params.idT
        };

        let dbObjs = req.models.favoriteNames;
        let groupObj = dbObjs.find(function(dbo) {
            if (dbo["name"] == req.params.groupN)
                return dbo;
        });

        groupObj["dbObj"]["teams"].push(favoriteTeam);
        let header = {
            _id: groupObj["dbObj"]["_id"],
            _rev: groupObj["dbObj"]["_rev"],
            group: groupObj["name"],
            teams: groupObj["dbObj"]["teams"]
        };

        couchdb.update(db_name, header, function(err, resData) {
            if (err)
                return next(err);

            let teams = req.models.teams;
            let idT = req.params.idT;
            let team = teams.find(function(t) {
                if (t["id"] == idT)
                    return t;
            });

            res.send(team);
        });
    });

router.get('/:idGroup/teams', reqDBParser.teamsOfGroups, reqDBParser.reqTeamsGroup, reqDBMapper.mapperTeamsFav,
    reqFavorites.requestAPI, reqMapper.mapperLeagues,
    function(req, res) {

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

router.get('/nextFixtures', reqFavorites.requestAPIFixtures, reqMapper.mapperFixtures,
    reqFavorites.requestAPILeagues, reqMapper.mapperLeagues,  function(req, res){

    let fixtures = req.models.fixtures;
    let nDays = (req.query.ndays)*1;
    let to = req.query.to; // up or down

    let current_date = new Date();
    let to_date = new Date();
    if (to == 'up') {
        to_date.setDate(current_date.getDate() + nDays);
    } else {
        to_date.setDate(current_date.getDate() - nDays);
    }

    let filtered_dates = fixtures.filter(function(fixture) {
        let form_date = new Date(fixture["date"]);
        if (to == 'up' && form_date > current_date && form_date < to_date)
            return true;
        if (to == 'down' && form_date > to_date && form_date < current_date)
            return true;
        return false;
    });

    let league = req.models.leagues.find(function(l) {
        if (l["id"] == req.query.idL)
            return l;
    });
    res.render('leaguesView/fixtures', { fixtures: filtered_dates, league: league } );
});

router.get('/fixtures/:idL/:idT/:name/:groupName', function(req, res){
    res.render('favoritesView/queryFixtures',
        { idL: req.params.idL, idT: req.params.idT, name: req.params.name, groupName: req.params.groupName } );
});

router.post('/deleteTeam', reqDBParser.requestDB, reqDBParser.requestFavoritesName,
    function(req, res) {

        if (req.body.ans == "N") {
            return res.redirect("/favorites/"+req.body.groupName+"/teams");
        } else if (req.body.ans == "Y") {
            let favoriteTeam = {
                "idL": req.body.idL,
                "idT": req.body.idT
            };
            req.models = req.models || {};

            let dbObjs = req.models.favoriteNames;
            let groupObj = dbObjs.find(function (dbo) {
                if (dbo["name"] == req.body.groupName)
                    return dbo;
            });
            let newArr = groupObj["dbObj"]["teams"];

            let header = {
                _id: groupObj["dbObj"]["_id"],
                _rev: groupObj["dbObj"]["_rev"],
                group: groupObj["name"],
                teams: newArr.filter(function(team) {
                    if (!(favoriteTeam["idT"] == team["idT"]))
                        return team;
                })
            };

            couchdb.update(db_name, header, function(err, resData) {
                if (err)
                    return next(err);
                res.redirect("/favorites/"+req.body.groupName+"/teams");
            });
        }


});

module.exports = router;

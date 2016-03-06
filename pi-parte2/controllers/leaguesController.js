
'use strict';

const express = require('express');
const router = express.Router();

//helpers middlewares that will help application logic
const reqAPI = require('../middlewares/api/ApiRequest');
const reqParser = require('../middlewares/api/ApiUrlHandler');
const reqMapper = require('../middlewares/api/ApiMapper');

const reqDBParser = require('../middlewares/database/databaseRequest');

let leagues = [];
let teams = [];

/*
*
* all this end points have a chain middleware
* parsing the url
* request the information from web api
* map the information to server side
*
* */

router.get('/leagues', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperLeagues,
function(req, res) {
      leagues = req.models.leagues;
      let descr = "This page have the information of all leagues from 2015/16 football season!";

      res.render('leaguesView/leagues', { title: 'Leagues info', description: descr, leagues: leagues, user: req.user });
});

router.get('/leagues/:idL/teams', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperTeams,
function(req, res) {
      teams = req.models.teams;

      res.render('leaguesView/teams', { title: 'Teams info', league: getLeague(req.params.idL), teams: teams, user: req.user });
});

router.get('/leagues/:idL/teams/:idT/players', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperPlayers,
    reqDBParser.requestDB, reqDBParser.requestFavoritesName,
function(req, res) {
      let id = req.params.idT;
      let favoriteNames = req.models.favoriteNames;
      let teamsWithId = putIdTeams(req.params.idL);
      let isFav = false;
      let team = getTeam(id);

      if (teamsWithId.length === 0) {
            for (let i = 0; i < favoriteNames.length; ++i) {
                  let arr = favoriteNames[i]["dbObj"]["teams"];
                  if (Array.isArray(arr))
                        for (let j = 0; j < arr.length; ++j) {
                              if (arr[j]["idT"] === id) {
                                    team["id"] = id;
                                    team["idL"] = arr[j]["idL"];
                              }
                        }
            }
      }

      for (let i = 0; i < favoriteNames.length; ++i) {
            let arr = favoriteNames[i]["dbObj"]["teams"];
            if (Array.isArray(arr))
                  for (let j = 0; j < arr.length; ++j) {
                        if (arr[j]["idT"] === id) {
                              isFav = true;
                              break;
                        }
                  }
            if (isFav) {
                  break;
            }
      }

      let favs = [];
      for (let i = 0; i < favoriteNames.length; ++i) {
            let arr = favoriteNames[i]["dbObj"]["teams"];
            if (arr !== undefined) {
                  let ret = -1;
                  arr.find(function(team) {
                        if ((team.idT)*1 === (req.params.idT)*1)
                              ret = 1;
                        return ret;
                  });
                  if (ret == -1) {
                        favs.push(favoriteNames[i]);
                  }
            }
      }

      if (favs.length > 0) {
            favoriteNames = favs;
      }

      res.render('leaguesView/players', { title: 'Players info', team: team, players: req.models.players,
            favoriteNames: favoriteNames, isFav: isFav, user: req.user });
});

router.get('/leagues/:idL/teams/:idT/teamFixtures', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperFixtures,
    function(req, res) {

          res.render('leaguesView/fixtures', { title: 'Team fixtures', team: getTeam(req.params.idT),
                league: getLeague(req.params.idL), fixtures: req.models.fixtures, user: req.user });
    });

router.get('/leagues/:idL/fixtures', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperFixtures,
function(req, res) {

      res.render('leaguesView/fixtures', { title: 'Fixtures info', league: getLeague(req.params.idL),
            fixtures: req.models.fixtures, user: req.user });
});

router.get('/leagues/:idL/leagueTables', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperLeagueTables,
function(req, res) {

      res.render('leaguesView/leagueTables', { title: 'Table info', league: getLeague(req.params.idL),
            leagueTables: req.models.leagueTables, user: req.user });
});

//helper functions
function putIdTeams(id) {
      let res = teams.map(function (team) {
            team["idL"] = id;
      });
      return res;
}

function getLeague(id) {
      let leagueView = leagues.find(function(l) {
            if (l["id"] == id)
                  return l;
      });
      return leagueView;
}

function getTeam(id) {
      let team = teams.find(function(t) {
            if (t["id"] == id)
                  return t;
      });
      return team;
}

module.exports = router;

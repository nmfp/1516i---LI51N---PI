
'use strict';

const express = require('express');
const router = express.Router();

const reqAPI = require('../middlewares/api/ApiRequest');
const reqParser = require('../middlewares/api/ApiUrlHandler');
const reqMapper = require('../middlewares/api/ApiMapper');

const reqDBParser = require('../middlewares/database/databaseRequest');

let leagues = [];
let teams = [];

//localhost:3000/football-data/leagues
router.get('/leagues', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperLeagues,
function(req, res) {
      req.models = req.models || {};
      leagues = req.models.leagues;
      let descr = "This page have the information of all leagues from 2015/16 football season!";
      res.render('leaguesView/leagues', { title: 'Leagues info', description: descr, leagues: leagues });
});

router.get('/leagues/:idL/teams', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperTeams,
function(req, res) {
      req.models = req.models || {};
      let id = req.params.idL;
      let league = getLeague(id);
      teams = req.models.teams;
      putIdTeams(id);
      for (let i = 0; i < teams.length; ++i) {
            teams[i]["idL"] = id;
      }
      res.render('leaguesView/teams', { title: 'Teams info', league: league, teams: teams });
});

router.get('/leagues/:idL/teams/:idT/players', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperPlayers,
    reqDBParser.requestDB, reqDBParser.requestFavoritesName,
function(req, res) {
      req.models = req.models || {};
      let id = req.params.idT;
      let team = {};
      let favoriteNames = req.models.favoriteNames
      putIdTeams(req.params.idL);
      let isFav = false;
      for (let i = 0; i < teams.length; ++i) {
            if(teams[i]["id"] == id) {
                  team = teams[i];
                  break;
            }
      }
      if (teams.length === 0) {
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
      res.render('leaguesView/players', { title: 'Players info', team: team, players: req.models.players, favoriteNames: favoriteNames, isFav: isFav });
});

router.get('/leagues/:idL/teams/:idT/teamFixtures', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperFixtures,
    function(req, res) {
          req.models = req.models || {};
          let id = req.params.idT;
          let team = {};
          for (let i = 0; i < teams.length; ++i) {
                if(teams[i]["id"] == id) {
                      team = teams[i];
                      break;
                }
          }
          res.render('leaguesView/fixtures', { title: 'Team fixtures', team: team, fixtures: req.models.fixtures });
    });

router.get('/leagues/:idL/fixtures', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperFixtures,
function(req, res) {
      req.models = req.models || {};
      let id = req.params.idL;
      let league = getLeague(id);
      let fixtures = req.models.fixtures;
      for (let i = 0; i < fixtures.length; ++i) {
            fixtures[i]["idL"] = id;
      }
      res.render('leaguesView/fixtures', { title: 'Fixtures info', league: league, fixtures: fixtures });
});

router.get('/leagues/:idL/leagueTables', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperLeagueTables,
function(req, res) {
      req.models = req.models || {};
      let id = req.params.idL;
      let league = getLeague(id);
      let leagueTables = req.models.leagueTables;
      for (let i = 0; i < leagueTables.length; ++i) {
            leagueTables[i]["idL"] = id;
      }
      res.render('leaguesView/leagueTables', { title: 'Table info', league: league, leagueTables: leagueTables });
});

function putIdTeams(id) {
      teams.map((team) => {
            team["idL"] = id;
});
}

function getLeague(id) {
      let leagueView = {};
      leagues.forEach((league) => {
            if (league["id"] == id)
            leagueView = league;
});
      return leagueView;
}

module.exports = router;

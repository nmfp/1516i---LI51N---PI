'use strict';

const express = require('express');
const router = express.Router();

const reqAPI = require('../middlewares/api/ApiRequest');
const reqParser = require('../middlewares/api/ApiUrlHandler');
const reqMapper = require('../middlewares/api/ApiMapper');

let leagues = [];
let teams = [];

//http://localhost:3000/football-data/leagues
//TODO get the league id, somehow
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
      let league = {};
      for (let i = 0; i < leagues.length; ++i) {
            if(leagues[i]["id"] == id) {
                  league = leagues[i];
                  break;
            }
      }
      teams = req.models.teams;
      for (let i = 0; i < teams.length; ++i) {
            teams[i]["idL"] = id;
      }
      res.render('leaguesView/league', { title: 'Teams info', league: league, teams: teams });
});

router.get('/leagues/:idL/teams/:idT/players', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperPlayers,
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
      res.render('leaguesView/players', { title: 'Players info', team: team, players: req.models.players });
});

router.get('/leagues/:idL/fixtures', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperTeams,
function(req, res) {
      res.render('leaguesView/fixtures', { title: 'Fixtures info' });
});

router.get('/leagues/:idL/leagueTables', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapperTeams,
function(req, res) {
      res.render('leaguesView/leagueTables', { title: 'Table info' });
});

module.exports = router;

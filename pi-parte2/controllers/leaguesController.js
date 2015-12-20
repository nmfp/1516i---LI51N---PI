'use strict';

const express = require('express');
const router = express.Router();

const reqAPI = require('../middlewares/api/ApiRequest');
const reqParser = require('../middlewares/api/ApiUrlHandler');
const reqMapper = require('../middlewares/api/ApiMapper');

//http://localhost:3000/football-data/leagues
//TODO get the league id, somehow
router.get('/leagues', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapper,
function(req, res) {
      req.models = req.models || {};
      let descr = "This page have the information of all leagues from 2015/16 football season!"
      res.render('leaguesView/leagues', { title: 'Leagues info', description: descr, leagues: req.models.leagues });
});

router.get('/leagues/{idL}/teams', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapper,
function(req, res) {
      res.render('leaguesView/teams', { title: 'Teams info' });
});

router.get('/leagues/{idL}/teams/{idT}/players', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapper,
function(req, res) {
      res.render('leaguesView/players', { title: 'Players info' });
});

router.get('/leagues/{idL}/fixtures', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapper,
function(req, res) {
      res.render('leaguesView/fixtures', { title: 'Fixtures info' });
});

router.get('/leagues/{idL}/leagueTables', reqParser.urlParser, reqAPI.requestAPI, reqMapper.mapper,
function(req, res) {
      res.render('leaguesView/leagueTables', { title: 'Table info' });
});

module.exports = router;

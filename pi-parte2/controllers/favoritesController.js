
'use strict';
const reqAPI = require('../middlewares/api/ApiRequest');
const reqMapper = require('../middlewares/api/ApiMapper');
const reqParser = require('../middlewares/api/ApiUrlHandler');

const express = require('express');
const router = express.Router();
const couchdb = require('node-couchdb');
const request = require("request");
const db = require("../middlewares/database/databaseHandler")
let teams = []
/* GET users listing. */
router.post('/insertTeam', function(req, res, next) {

    let favoriteTeam = {
       "teamidL":req.body.idL,
       "teamidT":req.body.idT
    }

  request.post({
    url: "http://localhost:5984/footballdata",
    body: favoriteTeam,
    json: true,
  }, function(err, resp, body) {
    if (err) return new Error(err);

    res.redirect("/football-data/leagues")
  })
  //res.send('respond with a resource');
});

router.get('/all', reqAPI.requestDB, reqAPI.requestTeamDB, reqMapper.mapperTeamsFav,
    function(req, res) {
        req.models = req.models || {};
        let teams = req.models.teams;
        let leagues = req.models.favouritesLeagueTeams;
        let i=0;
        for(let j=0;j<leagues.length;j++) {
            let id = leagues[j];
            teams[i++]["idL"] = id;
        }
        teams = req.models.teams;
        res.render('leaguesView/favoritesTeams', { title: 'Teams info', leagues:leagues, teams: teams });
    });

module.exports = router;

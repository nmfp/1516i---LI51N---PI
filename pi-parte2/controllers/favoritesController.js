
'use strict';

const express = require('express');
const router = express.Router();
const couchdb = require('node-couchdb');
const request = require("request");
const db = require("../middlewares/database/databaseHandler")

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

router.get('/all', function(req, res, next) {

  request({
    url: "http://localhost:5984/footballdata/_all_docs",
    json: true,
  }, function (err, resp, body) {
    console.log(body.rows);
    if (err) return new Error(err);
  });
  //res.send('respond with a resource');
})
module.exports = router;

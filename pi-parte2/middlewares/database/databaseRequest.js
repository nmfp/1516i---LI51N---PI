
'use strict';

const API_KEY = {'X-Auth-Token': 'e5c32bfec9734a3b8e65cd7b1a18b702'};
const request = require('request');

function requestDB(req, res, next) {
    request({
        url: "http://localhost:5984/footballdata/_all_docs",
        json: true,
    }, function (err, resp, body) {
        if (!err && resp["statusCode"] == 200) {
            let teamsID = body.rows;
            req.models = req.models || {};
            req.models.favoritesTeams = teamsID;

            return next();
        }else{
            return new Error(err);
        }
    });
};

function requestTeamDB(req, res, next) {
    console.log("ENTROU NO REQ TEM DB");
    let dbId = req.models.favoritesTeams;
    let i = 0;
    let result = [];
    dbId.forEach(function (teamid) {
        request("http://localhost:5984/footballdata/"+teamid["id"],
            function(err, resp, body) {
                if (!err && resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);

                    if (i++ == dbId.length - 1 ) {
                        reqTeams(result, next, req);
                    }
                } else {
                    return new Error(err);
                }
            });
    });

};

function reqTeams(favTeams, next, req) {
    let i = 0;
    let result = [];
    let resultLeagues = [];
    favTeams.forEach(function (team) {
        resultLeagues.push(team.idL);
        request({
                url: "".concat("http://api.football-data.org/v1/teams/", team.idT),
                headers: API_KEY
            },
            function (err, resp, body) {
                if (!err && resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);
                    if (i++ == favTeams.length - 1)
                        mapper(req, result, resultLeagues, next);
                } else {
                    return new Error(err);
                }
            });
    });
};


function mapper(req, result, resultLeagues, next) {
    req.models = req.models || {};

    req.models.favouritesLeagueTeams = resultLeagues;
    req.models.resapi = result;
    return next();
};


module.exports = {
    requestDB: requestDB,
    requestTeamDB: requestTeamDB
};
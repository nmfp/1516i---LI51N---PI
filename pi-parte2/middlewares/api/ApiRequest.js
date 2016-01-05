'use strict';

const request = require('request');
const API_KEY = {'X-Auth-Token': 'e5c32bfec9734a3b8e65cd7b1a18b702'};

//TODO final look

function requestDB(req,res,next){

    request({
        url: "http://localhost:5984/footballdata/_all_docs",
        json: true,
    }, function (err, resp, body) {
        if(!err && resp["statusCode"]==200) {
            let teamsID = body.rows
            req.models = req.models || {};
            req.models.favoritesTeams = teamsID;
            return next();
        }else{
            return new Error(err);
        }
    });
}
function requestAPI(req, res, next) {
    request({url: req.models.urlReq,
            headers: API_KEY },
     function(err, resp, body) {
        if (!err && resp["statusCode"] == 200) {
            let obj = JSON.parse(body);
            let result = [];
            result.push(obj);
            req.models = req.models || {};
            req.models.resapi = result;
            return next();
        } else {
            return new Error(err);
        }
    });
};

function requestTeamDB(req, res, next) {
    let dbId = req.models.favoritesTeams;
    let favTeams=[];
    var i =0;
    let result=[];
    dbId.forEach(function (teamid){

        request("http://localhost:5984/footballdata/"+teamid["id"],
            function(err, resp, body) {
                if (!err && resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);

                    if(i++ == dbId.length - 1 ){
                      reqTeams(result,next,req);
                    }
                } else {
                    return new Error(err);
                }
            });
    });

};

function reqTeams(favTeams,next,req){
    let i = 0;
    let result=[];
    let resultLeagues=[];
     favTeams.forEach(function (team) {
         resultLeagues.push(team.teamidL);
        request({
                url: "http://api.football-data.org/v1/teams/" + team.teamidT,
                headers: API_KEY
            },
            function (err, resp, body) {
                if (!err && resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);
                    if (i++ == favTeams.length - 1)
                        mapper(req, result,resultLeagues,next);
                } else {
                    return new Error(err);
                }
            });
    });
}


function mapper(req,result,resultLeagues,next){
    req.models = req.models || {};

    req.models.favouritesLeagueTeams = resultLeagues;
    req.models.resapi = result;
    return next();
}

module.exports = {
    requestAPI: requestAPI,
    requestDB:requestDB,
    requestTeamDB:requestTeamDB
};


'use strict';

const API_KEY = {'X-Auth-Token': 'e5c32bfec9734a3b8e65cd7b1a18b702'};
const request = require('request');
const couch = require('node-couchdb')

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

function teamsOfGroups (req,res,next){
    req.models = req.models || {};
    let id = req.params.idGroup;
    let viewName ="_design/formatDB/_view/formatDB";
    let database = "footballdata";
    let result=[]
    couch.get(database,viewName,null,function (err,resData){
        if(err)
            return new Error(err);

        result = resData.data.rows;

        result.forEach(function(group)
        {
            if (group.key === id) {
                req.models.favoritesTeams = group["value"];
                return next();
            }
        })
    });
}


function reqTeamsGroup(req, res, next) {
    let group = req.models.favoritesTeams;
    let result = [];
    let resultLeagues = [];

    let  i = 0;
    group.forEach(function (team) {
        resultLeagues.push(team.idL);
        request({
                url:"http://api.football-data.org/v1/teams/"+team.idT,
                headers: API_KEY
            },
            function (err, resp, body) {
                if (!err && resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);
                    if (i++ == group.length - 1)
                        mapper(req, result, resultLeagues, next);
                } else {
                    console.log(team.idT)
                    return new Error(err);
                }
            });
    });
};

function requestDBGroups(req, res, next) {
    request({
        url: "http://localhost:5984/footballdata/_all_docs",
        json: true,
    }, function (err, resp, body) {
        if (!err && resp["statusCode"] == 200) {
            let group = body.rows;
            req.models = req.models || {};
            req.models.groups = group;

            return next();
        }else{
            return new Error(err);
        }
    });
};

function requestNameGroup(req, res, next) {
    let dbId = req.models.groups;
    let i = 0;
    let result = [];

    dbId.forEach(function (group) {
        request("http://localhost:5984/footballdata/"+group["id"],
            function(err, resp, body) {
                if (!err && resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);

                    if (i++ == dbId.length - 1 ) {
                        req.models = req.models || {};

                        req.models.groupsName = result;
                        return next();
                    }
                } else {
                    return new Error(err);
                }
            });
    });

};

function requestTeamDB(req, res, next) {
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
                url:"http://api.football-data.org/v1/teams/"+team.idT,
                headers: API_KEY
            },
            function (err, resp, body) {
                if (!err && resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);
                    if (i++ == favTeams.length - 1)
                        mapper(req, result, resultLeagues, next);
                } else {
                    console.log(team.idT)
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
    requestTeamDB: requestTeamDB,
    requestDBGroups:requestDBGroups,
    requestNameGroup:requestNameGroup,
    reqTeamsGroup:reqTeamsGroup,
    teamsOfGroups:teamsOfGroups
};
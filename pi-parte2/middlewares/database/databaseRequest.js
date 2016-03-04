
'use strict';

const API_KEY = {'X-Auth-Token': 'e5c32bfec9734a3b8e65cd7b1a18b702'};
const request = require('request');
const couchdb = require('node-couchdb');

const db_name = "footballdata";
const db_url = "http://localhost:5984/footballdata";

function requestDB(req, res, next) {
    request({
        url: db_url+"/_all_docs",
        json: true
    }, function (err, resp, body) {
        if (err) {
            return next(err);
        }
        if (resp["statusCode"] == 200) {
            let teamsID = body.rows;
            req.models = req.models || {};
            req.models.favoritesTeams = teamsID;

            return next();
        }
    });
};

function teamsOfGroups (req, res, next) {
    req.models = req.models || {};
    let id = req.params.idGroup;
    let viewName = "_design/formatDB/_view/formatDB";
    let database = db_name;
    let result = [];
    couchdb.get(database, viewName, null, function (err, resData){
        if (err)
            return next(err);

        result = resData.data.rows;

        result.forEach(function(group) {
            if (group.key === id) {
                req.models.favoritesTeams = group["value"];
                return next();
            }
        });
        if (result.length == 0)
            return next();
    });
};

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
                if (err) {
                    return next(err);
                }
                if (resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);
                    if (i++ == group.length - 1)
                        mapper(req, result, resultLeagues, next);
                }
            });
    });
    if (group.length === 0)
        return next();
};

function requestDBGroups(req, res, next) {
    request({
        url: db_url+"/_all_docs",
        json: true
    }, function (err, resp, body) {
        if (err) {
            return next(err);
        }
        if (resp["statusCode"] == 200) {
            let group = body.rows;
            req.models = req.models || {};
            req.models.groups = group;
        }
        return next();
    });
};

function requestNameGroup(req, res, next) {
    req.models = req.models || {};
    let dbId = req.models.groups;
    let i = 0;
    let result = [];

    if (dbId == undefined || dbId.length == 0)
        return next();

    dbId.forEach(function (group) {
        request(db_url+"/"+group["id"],
            function(err, resp, body) {
                if (err) {
                    return next(err);
                }
                if (resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    if (obj["teams"] !== undefined)
                        result.push(obj);

                    if (i++ == dbId.length - 1 ) {
                        req.models = req.models || {};

                        req.models.groupsName = result;
                        return next();
                    }
                }
            });
    });

};

function requestTeamDB(req, res, next) {
    let dbId = req.models.favoritesTeams;
    let i = 0;
    let result = [];
    dbId.forEach(function (teamid) {
        request(db_url+"/"+teamid["id"],
            function(err, resp, body) {
                if (err) {
                    return next(err);
                }
                if (resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);

                    if (i++ == dbId.length - 1 ) {
                        reqTeams(result, next, req);
                    }
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
                if (err) {
                    return next(err);
                }
                if (resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push(obj);
                    if (i++ == favTeams.length - 1)
                        mapper(req, result, resultLeagues, next);
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

function requestFavoritesName(req, res, next) {
    let dbId = req.models.favoritesTeams;
    let i = 0;
    let result = [];
    req.models = req.models || {};
    dbId.forEach(function (favorite) {
        request(db_url+"/"+favorite["id"],
            function(err, resp, body) {
                if (err) {
                    return next(err);
                }
                if (resp["statusCode"] == 200) {
                    let obj = JSON.parse(body);
                    result.push({"name": obj["group"], "dbObj": obj});

                    if (i++ == dbId.length - 1 ) {
                        req.models.favoriteNames = result;
                        return next();
                    }
                }
            });
    });

};

module.exports = {
    requestDB: requestDB,
    requestTeamDB: requestTeamDB,
    requestDBGroups:requestDBGroups,
    requestNameGroup:requestNameGroup,
    reqTeamsGroup:reqTeamsGroup,
    teamsOfGroups:teamsOfGroups,
    requestFavoritesName: requestFavoritesName
};
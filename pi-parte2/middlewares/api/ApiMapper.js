
'use strict';

const leagueObj = require('../../models/apiObj/leagueObj.json');
const teamObj = require('../../models/apiObj/teamObj.json');
const playerObj = require('../../models/apiObj/playerObj.json');
const fixturesObj = require('../../models/apiObj/fixturesObj.json');
const leagueTableObj = require('../../models/apiObj/leagueTableObj.json');

//the json files required to this module, have the propertys that we want to retrieve from the web api

function mapperLeagues(req, res, next) {
    req.models = req.models || {};
    let idx = 0;
    if (req.models.resapiFav != undefined && req.models.resapiFav == true) {
        idx = 1;
    }
    let arr = req.models.resapi[idx];

    let leagues = arr.map(function(obj) {
        let props = Object.keys(leagueObj);
        let league = {};
        props.forEach(function (prop) {
            league[prop] = obj[prop];
        });
        return league;
    });

    req.models.leagues = leagues;
    return next();
};

function mapperTeams(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi[0]["teams"];

    let teams = arr.map(function(obj) {
        let props = Object.keys(teamObj);
        let team = {};
        props.forEach(function (prop) {
            if (prop == "_links") {
                let idParser = obj[prop]["self"]["href"];
                let id = getIdParser(idParser); //394
                team["id"] = id;
            }
            team[prop] = obj[prop];
        });
        return team;
    });

    req.models.teams = teams;
    return next();
};

function mapperPlayers(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi[0]["players"];

    let players = arr.map(function(obj) {
        let props = Object.keys(playerObj);
        let player = {};
        props.forEach(function (prop) {
            player[prop] = obj[prop];
        });
        return player;
    });

    req.models.players = players;
    return next();
};

function mapperFixtures(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi[0]["fixtures"];

    let fixtures = arr.map(function(obj) {
        let props = Object.keys(fixturesObj);
        let fixture = {};
        props.forEach(function (prop) {
            if (prop == "date") {
                let dateParser = obj[prop];
                let date = dateParser.substring(0, 10).trim(); //yyyy-mm-dd
                fixture[prop] = date;
                return;
            }
            if (prop == "_links") {
                let idParserHome = obj[prop]["homeTeam"]["href"];
                let idH = getIdParser(idParserHome); //5
                fixture["idH"] = idH;
                let idParserAway = obj[prop]["awayTeam"]["href"];
                let idA = getIdParser(idParserAway); //7
                fixture["idA"] = idA;
                return;
            }
            fixture[prop] = obj[prop];
        });
        return fixture;
    });

    req.models.fixtures = fixtures;
    return next();
};

function mapperLeagueTables(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi[0]["standing"];

    let leagueTables = arr.map(function(obj) {
        let props = Object.keys(leagueTableObj);
        let leagueTable = {};
        props.forEach(function (prop) {
            if (prop == "_links") {
                let idParserTeam = obj[prop]["team"]["href"];
                let idT = getIdParser(idParserTeam); //5
                leagueTable["idT"] = idT;
            }
            leagueTable[prop] = obj[prop];
        });
        return leagueTable;
    });

    req.models.leagueTables = leagueTables;
    return next();
};

//helper function
function getIdParser(url) {
    return url.substring(url.lastIndexOf('/')+1, url.length).trim();
}

module.exports = {
    mapperLeagues: mapperLeagues,
    mapperTeams: mapperTeams,
    mapperPlayers: mapperPlayers,
    mapperFixtures: mapperFixtures,
    mapperLeagueTables: mapperLeagueTables
};

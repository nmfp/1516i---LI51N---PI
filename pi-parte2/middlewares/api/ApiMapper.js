
'use strict';

const leagueObj = require('../../models/templates/leagueObj.json');
const teamObj = require('../../models/templates/teamObj.json');
const playerObj = require('../../models/templates/playerObj.json');
const fixturesObj = require('../../models/templates/fixturesObj.json');
const leagueTableObj = require('../../models/templates/leagueTableObj.json');

function mapperLeagues(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi[0];

    let leagues = [];
    for (let i = 0; i < arr.length; ++i) {
        let league = {};
        let obj = arr[i];
        for (let prop in leagueObj) {
            league[prop] = obj[prop];
        }
        leagues.push(league);
    }

    req.models.leagues = leagues;
    return next();
};

function mapperTeams(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi[0]["teams"];

    let teams = [];
    for (let i = 0; i < arr.length; ++i) {
        let team = {};
        let obj = arr[i];
        for (let prop in teamObj) {
            if (prop == "_links") {
                let idParser = obj[prop]["self"]["href"];
                let id = idParser.substring(idParser.lastIndexOf('/')+1, idParser.length).trim(); //394
                team["id"] = id;
            }
            team[prop] = obj[prop];
        }
        teams.push(team);
    }

    req.models.teams = teams;
    return next();
};

function mapperTeamsFav(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi;

    let teams = [];
    for (let i = 0; i < arr.length; ++i) {
        let team = {};
        let obj = arr[i];
        for (let prop in teamObj) {
            if (prop == "_links") {
                let idParser = obj[prop]["self"]["href"];
                let id = idParser.substring(idParser.lastIndexOf('/')+1, idParser.length).trim(); //394
                team["id"] = id;
            }
            team[prop] = obj[prop];
        }
        teams.push(team);
    }

    req.models.teams = teams;
    return next();
};

function mapperPlayers(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi[0]["players"];

    let players = [];
    for (let i = 0; i < arr.length; ++i) {
        let player = {};
        let obj = arr[i];
        for (let prop in playerObj) {
            player[prop] = obj[prop];
        }
        players.push(player);
    }

    req.models.players = players;
    return next();
};

function mapperFixtures(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi[0]["fixtures"];

    let fixtures = [];
    for (let i = 0; i < arr.length; ++i) {
        let fixture = {};
        let obj = arr[i];
        for (let prop in fixturesObj) {
            if (prop == "date") {
                let dateParser = obj[prop];
                let date = dateParser.substring(0, 10).trim(); //yyyy-mm-dd
                fixture[prop] = date;
                continue;
            }
            if (prop == "_links") {
                let idParserHome = obj[prop]["homeTeam"]["href"];
                let idH = idParserHome.substring(idParserHome.lastIndexOf('/')+1, idParserHome.length).trim(); //5
                fixture["idH"] = idH;
                let idParserAway = obj[prop]["awayTeam"]["href"];
                let idA = idParserAway.substring(idParserAway.lastIndexOf('/')+1, idParserAway.length).trim(); //7
                fixture["idA"] = idA;
            }
            fixture[prop] = obj[prop];
        }
        fixtures.push(fixture);
    }

    req.models.fixtures = fixtures;
    return next();
};

function mapperLeagueTables(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi[0]["standing"];

    let leagueTables = [];
    for (let i = 0; i < arr.length; ++i) {
        let leagueTable = {};
        let obj = arr[i];
        for (let prop in leagueTableObj) {
            if (prop == "_links") {
                let idParserTeam = obj[prop]["team"]["href"];
                let idT = idParserTeam.substring(idParserTeam.lastIndexOf('/')+1, idParserTeam.length).trim(); //5
                leagueTable["idT"] = idT;
            }
            leagueTable[prop] = obj[prop];
        }
        leagueTables.push(leagueTable);
    }

    req.models.leagueTables = leagueTables;
    return next();
};

module.exports = {
    mapperLeagues: mapperLeagues,
    mapperTeams: mapperTeams,
    mapperPlayers: mapperPlayers,
    mapperFixtures: mapperFixtures,
    mapperLeagueTables: mapperLeagueTables,
    mapperTeamsFav:mapperTeamsFav
};
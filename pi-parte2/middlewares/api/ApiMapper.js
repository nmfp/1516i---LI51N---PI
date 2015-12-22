'use strict';

const leagueObj = require('../../models/templates/leagueObj.json');
const teamObj = require('../../models/templates/teamObj.json');
//TODO create all other templates and refactor the name

//TODO a mapper for each api request

//TODO all leagues mapper, refactor the name
function mapperLeagues(req, res, next) {

    req.models = req.models || {};
    let arr = req.models.resapi[0];

    let leagues = [];
    for (let i = 0; i < arr.length; ++i) {
        let league = {};
        let obj = arr[i];
        for (let prop in leagueObj) {
            if (prop == "_links") {
                let idParser = obj[prop]["self"]["href"];
                let id = idParser.substring(idParser.lastIndexOf('/')+1, idParser.length).trim(); //394
                league["id"] = id;
            }
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

module.exports = {
    mapperLeagues: mapperLeagues,
    mapperTeams: mapperTeams
};
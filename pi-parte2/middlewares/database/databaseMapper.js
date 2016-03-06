
'use strict';

const teamObj = require('../../models/apiObj/teamObj.json');

function mapperTeamsFav(req, res, next) {
    req.models = req.models || {};
    let arr = req.models.resapi;

    if (arr === undefined) {
        return next();
    }

    let teams = [];
    for (let i = 0; i < arr.length; ++i) {
        let team = {};
        let obj = arr[i];
        for (let prop in teamObj) {
            if (prop == "_links") {
                let idParser = obj[prop]["self"]["href"];
                let id = getIdParser(idParser);
                team["id"] = id;
            }
            team[prop] = obj[prop];
        }
        teams.push(team);
    }

    req.models.teams = teams;
    return next();
};


function mapperGroup(req, res, next) {

    req.models = req.models || {};

    let arr = req.models.resapi;

    let groups = [];
    for (let i = 0; i < arr.length; ++i) {
        let team = {};
        let obj = arr[i];
        for (let prop in teamObj) {
            if (prop == "_links") {
                let idParser = obj[prop]["self"]["href"];
                let id = getIdParser(idParser);
                team["id"] = id;
            }
            team[prop] = obj[prop];
        }
        teams.push(team);
    }

    req.models.teams = teams;
    return next();
};

function getIdParser(url) {
    return url.substring(url.lastIndexOf('/')+1, url.length).trim();
}

module.exports = {
    mapperTeamsFav: mapperTeamsFav,
    mapperGroup:mapperGroup
};

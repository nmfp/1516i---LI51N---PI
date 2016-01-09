
'use strict';

const teamObj = require('../../models/templates/teamObj.json');

function mapperTeamsFav(req, res, next) {
    console.log("ENTROU NO REQ DO MAPPER");
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

module.exports = {
    mapperTeamsFav: mapperTeamsFav
};
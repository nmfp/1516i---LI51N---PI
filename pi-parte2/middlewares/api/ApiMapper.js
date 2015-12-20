'use strict';

const template = require('../../models/templates/leagueObj.json');
//TODO create all other templates and refactor the name

//TODO a mapper for each api request

//TODO all leagues mapper, refactor the name
function mapper(req, res, next) {

    req.models = req.models || {};
    let arr = req.models.resapi[0];

    let leagues = [];
    for (let i = 0; i < arr.length; ++i) {
        let league = {};
        let obj = arr[i];
        for (let prop in template) {
            league[prop] = obj[prop];
        }
        leagues.push(league);
    }

    req.models.leagues = leagues;
    return next();
};

module.exports = {
    mapper: mapper
};
'use strict';

const BASE_URL = "http://api.football-data.org/v1/";

//javascript can work as a hashmap object, so this will be the strategy based with the endpoints to retrieve information
const map = {
    "leagues": "soccerseasons",
    "teams": "soccerseasons/{idL}/teams",
    "players": "teams/{idT}/players",
    "fixtures": "soccerseasons/{idL}/fixtures",
    "leagueTables": "soccerseasons/{idL}/leagueTable",
    "teamFixtures": "teams/{idT}/fixtures"
};

//this function will returns a valid url from the web api

function urlParser(req, res, next) {
    req.models = req.models || {};
    
    let url = req.url;
    let option = "";
    let arr = url.split('/');
    let returnCicle = false;
    for (let i = arr.length-1; i > 0; --i) {
        if (arr[i].length > 1) {
            for (let prop in map) {
                if (prop == arr[i]) {
                    option = map[prop];
                    returnCicle = true;
                    break;
                }
            }
        }
        if (returnCicle) {
            break;
        }
    }

    if (req.params.idL != undefined) {
        option = option.replace("{idL}", req.params.idL);
    }
    if (req.params.idT != undefined) {
        option = option.replace("{idT}", req.params.idT);
    }
    req.models.urlReq = BASE_URL.concat(option);
    return next();
};

module.exports = {
    urlParser: urlParser
};

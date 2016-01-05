'use strict';

/*
 http://api.football-data.org/v1/soccerseasons

 http://api.football-data.org/v1/soccerseasons/394/teams
 http://api.football-data.org/v1/teams/5/players
 http://api.football-data.org/v1/teams/5

 http://api.football-data.org/v1/soccerseasons/394/fixtures
 http://api.football-data.org/v1/soccerseasons/394/leagueTable

 football-data/leagues
 football-data/leagues/{idLeague}/teams
 football-data/leagues/{idLeague}/teams/{idTeam}/players
 football-data/leagues/{idLeague}/fixtures
 football-data/leagues/{idLeague}/leagueTable
 */

const BASE_URL = "http://api.football-data.org/v1/";

const map = {
    "leagues": "soccerseasons",
    "teams": "soccerseasons/{idL}/teams",
    "players": "teams/{idT}/players",
    "fixtures": "soccerseasons/{idL}/fixtures",
    "leagueTables": "soccerseasons/{idL}/leagueTable",
    "teamFixtures":"teams/{idT}/fixtures"
};

function urlParser(req, res, next) {
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

    req.models = req.models || {};
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

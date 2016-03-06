
'use strict';

const request = require('request');
const API_KEY = {'X-Auth-Token': 'e5c32bfec9734a3b8e65cd7b1a18b702'};

const base_url = "http://api.football-data.org/v1/soccerseasons";

//this module is import to be more easy the retrieving information from the web api and handle it in the server side

function requestAPIFavorites(req, res, next) {
    req.models = req.models || {};

    let reqURL;
    let arr = req.url.split('/');
    if (arr[2] == "teams") {
        reqURL = base_url;
    } else if (arr[1] == "changeT") {
        reqURL = base_url+"/{id}/teams".replace("{id}", arr[2]);
    } else if (arr[1] == "addT") {
        reqURL = base_url+"/{id}/teams".replace("{id}", arr[3]);
    }

    request({url: reqURL,
            headers: API_KEY },
        function(err, resp, body) {
            if (err) {
                return next(err);
            }
            if (resp["statusCode"] == 200) {
                let result = [];
                result.push(JSON.parse(body));
                req.models.resapi = result;
            }
            return next();
        });
};

function requestAPIFixtures(req, res, next) {
    req.models = req.models || {};

    let idT = req.query.idT;
    const reqURL = "http://api.football-data.org/v1/teams/{idT}/fixtures";

    request({url: reqURL.replace("{idT}", idT),
            headers: API_KEY },
        function(err, resp, body) {
            if (err) {
                return next(err);
            }
            if (resp["statusCode"] == 200) {
                let result = [];
                result.push(JSON.parse(body));
                req.models.resapi = result;
            }
            return next();
        });
};

function requestAPILeagues(req, res, next) {
    req.models = req.models || {};

    const reqURL = "http://api.football-data.org/v1/soccerseasons";

    request({url: reqURL,
            headers: API_KEY },
        function(err, resp, body) {
            if (err) {
                return next(err);
            }
            if (resp["statusCode"] == 200) {
                req.models.resapi.push(JSON.parse(body));
                req.models.resapiFav = true;
            }
            return next();
        });
};

module.exports = {
    requestAPI: requestAPIFavorites,
    requestAPIFixtures: requestAPIFixtures,
    requestAPILeagues: requestAPILeagues
};

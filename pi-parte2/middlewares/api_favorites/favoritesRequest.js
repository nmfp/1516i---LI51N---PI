
'use strict';

const request = require('request');
const API_KEY = {'X-Auth-Token': 'e5c32bfec9734a3b8e65cd7b1a18b702'};

const base_url = "http://api.football-data.org/v1/soccerseasons";

function requestAPIFavorites(req, res, next) {
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
            if (!err && resp["statusCode"] == 200) {
                JSON.parse(body)
                let result = [];
                result.push(JSON.parse(body));
                req.models.resapi = result;
                return next();
            } else {
                return next(err);
            }
        });
};

module.exports = {
    requestAPI: requestAPIFavorites
};

'use strict';

const request = require('request');
const API_KEY = {'X-Auth-Token': 'e5c32bfec9734a3b8e65cd7b1a18b702'};

//TODO final look

function requestAPI(req, res, next) {
    request({url: req.models.urlReq,
            headers: API_KEY },
     function(err, resp, body) {
        if (!err && resp["statusCode"] == 200) {
            let obj = JSON.parse(body);
            let result = [];
            result.push(obj);

            req.models = req.models || {};
            req.models.resapi = result;
            return next();
        } else {
            return new Error(err);
        }
    });
};

module.exports = {
    requestAPI: requestAPI
};

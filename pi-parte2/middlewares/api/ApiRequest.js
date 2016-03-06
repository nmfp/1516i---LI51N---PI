
'use strict';

const request = require('request');
const API_KEY = {'X-Auth-Token': 'e5c32bfec9734a3b8e65cd7b1a18b702'};

//request module, that will store the information in the req.models property

function requestAPI(req, res, next) {
    request({url: req.models.urlReq,
            headers: API_KEY },
        function(err, resp, body) {
            if (err) {
                return next(err);
            }
            if (resp["statusCode"] == 200) {
                req.models = req.models || {};
                let result = [];
                result.push(JSON.parse(body));
                req.models.resapi = result;
                return next();
            }
        });
};

module.exports = {
    requestAPI: requestAPI
};


'use strict';

const request = require('request');

const db_base_url = "http://localhost:5984/";

//this module will be triggered with an ajax request to some specific end-point
//the goal here is to validate the database, or create the database and the view
//this view is important for a more detail query

const end_point = {
    "user": "userlogin",
    "favorites": "footballdata"
};

const favorites_view = require('../../models/couchdbView/favoritesView.json');
const users_view = require('../../models/couchdbView/userView.json');

const setView = {
    "user": users_view,
    "favorites": favorites_view
};

let db_url;

function checkDatabase(req, res, next) {
    let arr = req.originalUrl.split('/');
    db_url = db_base_url+end_point[arr[1]];

    request({uri: db_url, method: 'GET'},
        function (err, response, body) {
            if (err)
                return next(err);
            req.models = req.models || {};
            req.models.dbstate = false;
            if (response.statusCode !== 200) {
                req.models.dbstate = true;
            }
            return next();
        });
};

function createDatabase(req, res, next) {
    req.models = req.models || {};

    if (req.models.dbstate) {
        request({uri: db_url, method: 'PUT'},
            function (err, response, body) {
                if (err)
                    return next(err);

                req.models.setView = false;
                if (response.statusCode === 201) {
                    req.models.setView = true;
                }
                return next();
            });
    } else
        return next();
};

function createView(req, res, next) {
    req.models = req.models || {};

    if (req.models.setView) {
        let arr = req.originalUrl.split('/');
        let dbView = setView[arr[1]];
        request.post({
            uri: db_url,
            body: dbView,
            json: true
        }, function(err, resp, body) {
            if (err)
                return next(err);
            return next();
        });
    } else
        return next();
};

module.exports = {
    checkDatabase: checkDatabase,
    createDatabase: createDatabase,
    createView: createView
};

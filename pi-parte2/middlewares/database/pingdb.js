
'use strict';

const request = require('request');

const db_base_url = "http://localhost:5984/";

const end_point = {
    "user": "footballdata",
    "favorites": "userslogin"
};

const favorites_view = require('../../models/couchdbView/favoritesView.json');
const users_view = require('../../models/couchdbView/usersView.json');

const setView = {
    "user": users_view,
    "favorites": favorites_view
};

let db_url;

function checkDatabase(req, res, next) {
    let arr = req.url.split('/');
    db_url = db_base_url+end_point[arr[1]];

    request({uri: db_url, method: 'GET'},
        function (err, response, body) {
            if (err)
                return next(err);
            req.models = req.models || {};
            req.models.dbstate = false;
            if (response.statusCode !== 201) {
                req.models.dbstate = true;
                console.log("Database is not created");
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
                if (response.statusCode === 200) {
                    req.models.setView = true;
                    console.log("View is going to be generated!")
                }
                return next();
            });
    } else
        return next();
};

function createView(req, res, next) {
    req.models = req.models || {};

    if (req.models.setView) {
        let arr = req.url.split('/');
        let dbView = setView[arr[0]];
        request.post({
            uri: db_url,
            body: dbView,
            json: true
        }, function(err, resp, body) {
            if (err)
                return next(err);
            console.log("View "+dbView["_id"]+" is stored!");
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

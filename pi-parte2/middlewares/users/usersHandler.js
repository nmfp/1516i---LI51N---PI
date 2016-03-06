
'use strict';

const couchdb = require('node-couchdb');

const db_name = "userlogin";
const viewName = "_design/usersview/_view/userv";

//this module retuns a valid user registed in the web application

function getOne(username, callback) {
    couchdb.get(db_name, viewName, null, function(err, resData) {
        if (err)
            return callback(err);

        let result = resData.data.rows;
        let res = result.find(function(user) {
            if (user.value.username === username) {
                return user;
            }
        });
        if (res == undefined) {
            res = {};
        }
        callback(null, res.value);
    });
};

module.exports = {
    getOne: getOne
};

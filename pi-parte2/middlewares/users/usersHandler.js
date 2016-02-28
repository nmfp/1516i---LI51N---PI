
'use strict';

const couchdb = require('node-couchdb');

const db_name = "userlogin";
//const db_url = "http://localhost:5984/"+db_name;

function getOne(id, callback) {
    let viewName = "_design/usersview/_view/userv";

    couchdb.get(db_name, viewName, null, function(err, resData) {
        if (err)
            return next(err);

        let result = resData.data.rows;
        result.forEach(function(user) {
            if (user.key === id) {
                callback(user);
            }
        });
    });
};

module.exports = {
    getOne: getOne
};



'use strict';

const couchdb = require('node-couchdb');
const request = require('request');

module.exports.all = function (db, options, done) {
     request({
         url: "http://localhost:5984/footballdata",
         json: true
     }, function(err, resp, body) {
         console.log(body);
         if (err)
             return new Error(err);
     });
};

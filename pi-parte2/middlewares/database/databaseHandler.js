const couchdb = require('node-couchdb');

const memcacheClient = require("memcache").Client(11211, "localhost");
memcacheClient.on("connect", function () {
    memcacheClient.invalidate = function () {};
    let couch = new nodeCouchDB("localhost", 5984, memcacheClient);
});

memcacheClient.connect();
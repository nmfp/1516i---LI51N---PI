
'use strict';

const express = require('express');
const router = express.Router();
const couchdb = require('node-couchdb');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

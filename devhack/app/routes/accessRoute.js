var express = require('express');
var router = express.Router();

var access = require('../controllers/accessController');

// create a new access (login) record
router.post('/', access.create_an_access);

// authentication process
router.post('/authenticate', access.authenticate);

module.exports = router;

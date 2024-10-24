var express = require('express');
var router = express.Router();

const { Test } = require('../controllers/test')

router.all('/truncate', (req, res) => { Test.asView(req, res) })

module.exports = router
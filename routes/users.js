var express = require('express');
var router = express.Router();

const { SignUp, SignIn, Update, SignOut }  = require('../controllers/auth')

router.all('/sign-up', (req, res) => { SignUp.asView(req, res) })
router.all('/sign-in', (req, res) => { SignIn.asView(req, res) })

router.all('/infors', (req, res) => { Update.asView(req, res) })
router.all('/avatar', (req, res) => { Update.asView(req, res) })

router.all('/sign-out', (req, res) => { SignOut.asView(req, res) })

module.exports = router;

var express = require('express');
var router = express.Router();


const { ScheduledRemindersController }  = require('../controllers/scheduled_reminders')

router.all('/scheduled', (req, res) => { ScheduledRemindersController.asView(req, res) })

module.exports = router
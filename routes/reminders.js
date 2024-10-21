var express = require('express');
var router = express.Router();


const { ScheduledRemindersController, ScheduledReminderController }  = require('../controllers/scheduled_reminders')

router.all('/scheduled', (req, res) => { ScheduledRemindersController.asView(req, res) })
router.all('/scheduled/:reminder_id', (req, res) => { ScheduledReminderController.asView(req, res) })

module.exports = router
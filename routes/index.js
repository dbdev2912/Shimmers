var express = require('express');
var router = express.Router();

/* GET home page. */

const ping = (req, res, next) => {
  console.log("PING")
  next()
}

const pong = (req, res, next) => {
  console.log("PONK")
  res.send({
    success: true
  })
  // res.end("Ủa là sao má")
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/pig', ping, pong)

module.exports = router;

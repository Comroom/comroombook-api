var express = require('express');
var router = express.Router();

var time = db['time'];

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

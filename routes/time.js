var express = require('express');
var router = express.Router();

var time = db['time'];

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/time', function(req, res, next) {
  res.render('index', { title: 'Express' });

  var body = req.body;
  var session = req.session;

  var inputs = {
    day : body.day,
    start : body.start,
    end : body.end,
    userid : body.userid,
    title : body.title,
    detail : body.detail
  };

  time.insert();
});

module.exports = router;

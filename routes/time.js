var express = require('express');
var router = express.Router();

var time = db['time'];

router.get('/', function(req, res, next) {
  time.find({}, function(err, docs){
    if(err){

    }else{
      res.json(docs);
    }
  });
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

router.delete('/',function(req, res, next) {
  var body = req.body;
  var id = req.time_id;

  time.remove({ "_id" : id }, function(err, num) {
    if(err){

    }else{
      res.json({ "result" : "삭제 성공하였습니다"});
    }
  });
});
module.exports = router;

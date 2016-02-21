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

router.post('/', function(req, res, next) {
  var body = req.body;

  if( !body.hasOwnProperty("day") || !body.hasOwnProperty("start")
      || !body.hasOwnProperty("end") || !body.hasOwnProperty("userid")
      || !body.hasOwnProperty("title") || !body.hasOwnProperty("detail")){
    res.json({ "error" : "데이터 입력이 잘못되었습니다."});
    return;
  }

  var inputs = {
    day : body.day,
    start : body.start,
    end : body.end,
    userid : body.userid,
    title : body.title,
    detail : body.detail
  };

  var day = body.day;

  if( day != "MON" && day != "TUE"
  && day != "WED" && day != "THU"
  && day != "FRI" && day != "SAT" && day != "SUN"){
    res.json({"error" : "입력한 데이터가 잘못되었습니다."});
     return;
  }

  var start = body.start;
  var end = body.end;

  if( !TimeCheck(start) || !TimeCheck(end)){
    res.json({"error" : "입력한 데이터가 잘못되었습니다."});
    return;
  }

  time.find({ "day" : body.day}, function(err, docs) {
    var check = false;
    for(var i=0;i<docs.length;i++){
      //겹치는 경우1
      if( body.start >= docs[i].start  && body.start < docs[i].end ){
        check = true;
        break;
      }
      //겹치는 경우2
      if( body.end > docs[i].start && body.end <= docs[i].end){
        check = true;
        break;
      }
      //겹치는 경우3
      if( body.start <= docs[i].start && body.end >= docs[i].end){
        check = true;
        break;
      }
    }

    if(check == true){
      res.json({"error" : "시간이 겹칩니다!"});
    }else{
      time.insert(inputs,function(err,doc) {
        if(err){

        }else{
          res.json({"result" : "시간 입력이 완료되었습니다"});
        }
      });
    }
  });
});

router.delete('/',function(req, res, next) {
  var body = req.body;
  var id = body.time_id;

  time.remove({ "_id" : id }, function(err, num) {
    if(err){

    }else{
      res.json({ "result" : "삭제 성공하였습니다"});
    }
  });
});

function TimeCheck(time){
  //13:00 시간 형태 체크
  var regex = /\d{2}[:]\d{2}/;

  if( typeof(time) != 'string'){
    return false;
  }
  
  if( time.length != 5){
    return false;
  }

  if( !regex.test(time)){
    return false;
  }

  return true;
}
module.exports = router;

var express = require('express');
var router = express.Router();

var time = db['time'];
var users = db['users'];

router.get('/', function(req, res, next) {
  time.find({}, function(err, docs){
    if(err){
      res.status(400);
      res.json({"error" : "DB 에러"});
    }else{
      res.status(200);
      res.json(docs);
    }
  });
});

router.post('/', function(req, res, next) {
  var body = req.body;

  users.find({ _id : body.userid }, function(err, docs){
    if(err){
      res.status(400);
      res.json({"error" : "DB 에러"});
    }
    else if(docs.length == 0){
      res.status(400);
      res.json({ "error" : "1차 존재하지 않는 아이디입니다." });
    }else{
      if( !body.hasOwnProperty("day") || !body.hasOwnProperty("start")
          || !body.hasOwnProperty("end") || !body.hasOwnProperty("userid")
          || !body.hasOwnProperty("title") || !body.hasOwnProperty("detail")){
        res.status(400);
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
        res.status(400);
        res.json({"error" : "입력한 요일 데이터가 잘못되었습니다."});
        return;
      }

      var start = body.start;
      var end = body.end;
    //시간 입력이 시작시간과 종료시간 둘다 맞게 들어오는게 아니라면 에러
      if( !TimeCheck(start) || !TimeCheck(end)){
        res.status(400);
        res.json({"error" : "입력한 시간 데이터가 잘못되었습니다."});
        return;
      }
// 이 코드를 쓸경우 에러. 콜백이 여러번(잘못 쓸경우) 들어가는 경우라고 한다..
      // users.find({ _id : body.userid }, function(err, docs){
      //   if(docs.length == 0){
      //     res.json({ "error" : "1차 존재하지 않는 아이디입니다." });
      //   }else{
      //     res.json({ "result" : "1차 성공!" });
      //   }
      // });

      // if( !IdCheck(body.userid) ){
      //   res.json({ "error" : "해당 아이디가 없습니다." + body.userid });
      //   return;
      // }

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
          res.status(400);
          res.json({"error" : "시간이 겹칩니다!"});
        }else{
          time.insert(inputs,function(err,doc) {
            if(err){
              res.status(400);
              res.json({"error" : "DB 에러"});
            }else{
              res.status(200);
              res.json({"result" : "시간 입력이 완료되었습니다"});
            }
          });
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
      res.status(400);
      res.json({"error" : "DB 에러"});
    }else{
      res.status(200);
      res.json({ "result" : "삭제 성공하였습니다"});
    }
  });
});

// function IdCheck(userId){
//   users.find({ _id : userId }, function(err, docs){
//     if(docs.length == 0){
//       //res.json({ "error" : "존재하지 않는 아이디입니다." });
//       return false;
//     }else{
//       return true;
//     }
//   });
// }

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

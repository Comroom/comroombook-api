var express = require('express');
var router = express.Router();

var message = db['message'];
var user = db['users'];

router.get('/:user_id',function(req,res,next){
  var user_id = req.params.user_id;
//findOne 이 하나를 지정해서 찾는다는??
  user.findOne({ "_id" : user_id },function(err,doc) {
    if(err){
      res.status(500);
      res.json({"error" : "DB 에러"});

    }else{
      if( doc == null){
        res.status(400);
        res.json({"error":"없는 아이디입니다."});
      }
      else{
        message.find({ "receiver" : user_id },function(err,docs){
          res.status(200);
          res.json(docs);
        });
      }
    }
  });
});

router.post('/:userid',function(req,res,next){
  var body = req.body;
  var user_id = req.params.userid;
  var inputs = {
    sender : body.sender,
    receiver : user_id,
    message : body.message,
    date : new Date()
  };
  user.find({ _id : body.sender }, function(err, docs){
    if(err){
      res.status(500);
      res.json({"error" : "DB 에러"});
    }
    else if(docs.length == 0){
      res.status(400);
      res.json({ "error" : "잘못된 sender 아이디 입니다." });

    }else{
      user.find({ _id : user_id }, function(err, docs){
        if(err){
          res.status(500);
          res.json({"error" : "DB 에러"});
        }
        else if(docs.length == 0){
          res.status(400);
          res.json({ "error" : "잘못된 receiver 아이디 입니다." });

        }else{
          if(body.message.length == 0){
            res.status(400);
            res.json({ "error" : "메세지가 입력 안되었습니다." });
          }else{
            message.insert(inputs, function(err, docs){
              if(err){
                res.status(500);
                res.json({ "error" : "DB 에러" });

              }else{
                res.status(200);
                res.json({ "result" : "입력 성공!" });
              }
            });
          }
        }
      });
    }
  });
});

module.exports = router;

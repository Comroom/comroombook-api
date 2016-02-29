var express = require('express');
var router = express.Router();

var message = db['message'];
var user = db['users'];

router.get('/:user_id',function(req,res,next){
  var user_id = req.params.user_id;

  user.findOne({ "_id" : user_id },function(err,doc) {
    if(err){

    }else{
      if( doc == null){
        res.json({"error":"없는 아이디입니다."});
      }
      else{
        message.find({ "receiver" : user_id },function(err,docs){
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
    sender : body.userid,
    receiver : user_id,
    message : body.message,
    date : new Date()
  };
  user.find({ _id : body.userid }, function(err, docs){
    if(docs.length == 0){
      res.json({ "error" : "잘못된 sender 아이디 입니다." });
    }else{
      user.find({ _id : user_id }, function(err, docs){
        if(docs.length == 0){
          res.json({ "error" : "잘못된 receiver 아이디 입니다." });
        }else{
          if(body.message.length == 0){
            res.json({ "error" : "메세지가 입력 안되었습니다." });
          }else{
            message.insert(inputs, function(err, docs){
              if(err){
                res.json({ "error" : "디비 에러!" });
              }else{
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

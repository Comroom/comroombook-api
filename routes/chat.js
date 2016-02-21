var express = require('express');
var router = express.Router();

var users = db['users'];
var chat = db['chat'];

router.post('/list', function(req, res, next){
  var body = req.body;
  //req.params.channel은 뭘까?
  var ch = body.channel;

  users.find({ _id : body.userid }, function(err, docs){
    if(docs.length == 0){
      res.json({ "error" : "존재하지 않는 아이디입니다." });
    }else{
      var inputs = {
        userid : body.userid,
        //body.name 쓸경우 입력한 name이 들어가게 되고
        //docs[0].name을 쓰면 users 디비에 있는 항목에서 이름을 쓰게 됨.
        name : docs[0].name,
        email : docs[0].email,
        //채널은 왜 안될까?
        channel : ch,
        message : body.message,
        date : new Date()
      };
      chat.insert(inputs, function(err, docs){
        if(err){
          res.json({ "error" : "채팅 내용이 깨졌습니다." });
        }else{
          res.json({ "result" : "채팅정상입력" });
        }
      });
    }
  });
});

module.exports = router;

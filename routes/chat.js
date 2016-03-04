var express = require('express');
var router = express.Router();

var users = db['users'];
var chatmessage = db['chatmessage'];
var chatlist = db['chatlist'];

router.get('/list', function(req, res, next){
  chatlist.find({}, function(err, docs){
    if(err){
      res.status(400);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.status(400);
      res.json({ "error" : "그룹 리스트가 없습니다." });
    }else{
      res.status(200);
      res.json(docs);
    }
  });
});

router.post('/list', function(req, res, next){
  var body = req.body;
  //req.params.channel은 뭘까?
  var ch = body.channel;

  users.find({ _id : body.userid }, function(err, docs){
    if(err){
      res.status(400);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.json({ "error" : "존재하지 않는 아이디입니다." });
    }else{
      var inputs = {
        userid : body.userid,
        //body.name 쓸경우 입력한 name이 들어가게 되고
        //docs[0].name을 쓰면 users 디비에 있는 항목에서 이름을 쓰게 됨.
        name : body.name,
        member : body.member,
        date : new Date()
      };
      chatlist.insert(inputs, function(err, docs){
        if(err){
          res.status(400);
          res.json({ "error" : "DB 에러입니다." });
        }else{
          res.status(200);
          res.json({ "result" : "그룹정상등록" });
        }
      });
    }
  });
});

router.get('/:group_id', function(req, res, next){
  var group_id = req.params.group_id;

  chatmessage.find({ groupid : group_id }, function(err, docs){
    if(err){
      res.status(400);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.status(400);
      res.json({ "error" : "해당 그룹 메세지가 없습니다." });
    }else{
      res.status(200);
      res.json(docs);
    }
  });
});

router.post('/:group_id', function(req, res, next){
  var body = req.body;
  var group_id = req.params.group_id;

  chatlist.find({ _id : group_id }, function(err, docs){
    if(err){
      res.status(400);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.status(400);
      res.json({ "error" : "메세지를 입력할 해당 그룹이 없습니다." });
    }else{
      var inputs = {
        userid : body.userid,
        name : docs[0].name,
        groupid : group_id,
        message : body.message,
        date : new Date()
      };
      chatmessage.insert(inputs, function(err, docs){
        if(err){
          res.status(400);
          res.json({ "error" : "DB 에러입니다." });
        }else{
          res.status(200);
          res.json({ "result" : "그룹에 메세지 정상 입력." });
        }
      });
    }
  });
});

router.get('/member/:group_id',function(req,res,next) {
  var group_id = req.params.group_id;
  chatlist.findOne({ _id : group_id },function(err,doc) {
    if(err){
      res.status(400);
      res.json({ "error" : "DB 에러입니다." });
    }else{
      res.status(200);
      res.json(doc);
    }
  });
});

router.post('/member/:group_id',function(req,res,next){
  var body = req.body;
  var group_id = req.params.group_id;
  var user_id = body.userid;

  users.find({ _id : body.userid }, function(err, docs){
    if(err){
      res.status(400);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.json({ "error" : "존재하지 않는 아이디입니다." });
    }else{
      chatlist.findOne({ _id : group_id }, function(err, doc){
        if(err){
          res.status(400);
          res.json({ "error" : "DB 에러입니다." });
        }else{
          doc.member.push(user_id);

          chatlist.update({ _id : group_id }, doc ,{ }, function(err,numReplaced){
            if(err){
              res.status(400);
              res.json({ "error" : "DB 에러입니다." });
            }else{
              res.status(200);
              res.json({ "result" : "채팅방 입장하였습니다", "user_id" : user_id });
            }
          });
        }
      });
    }
  });
});

router.delete('/member/:group_id',function(req,res,next){
  var body = req.body;
  var group_id = req.params.group_id;
  var user_id = body.userid;

  users.find({ _id : body.userid }, function(err, docs){
    if(err){
      res.status(400);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.json({ "error" : "존재하지 않는 아이디입니다." });
    }else{
      chatlist.findOne({ _id : group_id }, function(err, doc){
        if(err){
          res.status(400);
          res.json({ "error" : "DB 에러입니다." });
        }else{
          for(var i=0;i<doc.member.length;i++){
            if(doc.member[i] == user_id){
              doc.member.splice(i,1);
              break;
            }
          }
          chatlist.update({ _id : group_id }, doc ,{ }, function(err,numReplaced){
            if(err){
              res.status(400);
              res.json({ "error" : "DB 에러입니다." });
            }else{
              res.status(200);
              res.json({ "result" : "채팅방 퇴장하였습니다"});
            }
          });
        }
      });
    }
  });
});

module.exports = router;

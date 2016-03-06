var express = require('express');
var router = express.Router();

var users = db['users'];
var chatmessage = db['chatmessage'];
var chatlist = db['chatlist'];

//그룹 목록을 받음
router.get('/list', function(req, res, next){
  chatlist.find({}, function(err, docs){
    if(err){
      res.status(500);
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
//그룹을 만듬
router.post('/list', function(req, res, next){
  var body = req.body;

  users.find({ _id : body.userid }, function(err, docs){
    if(err){
      res.status(500);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.json(400);
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
          res.status(500);
          res.json({ "error" : "DB 에러입니다." });
        }else{
          res.status(200);
          res.json({ "result" : "그룹정상등록" });
        }
      });
    }
  });
});
//해당 그룹아이디의 메세지 목록을 받음
router.get('/:group_id', function(req, res, next){
  var group_id = req.params.group_id;

  chatmessage.find({ groupid : group_id }, function(err, docs){
    if(err){
      res.status(500);
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
//해당 그룹아이디로 메세지를 입력함
router.post('/:group_id', function(req, res, next){
  var body = req.body;
  var group_id = req.params.group_id;

  users.find({ _id : body.userid }, function(err, docs){
    if(err){
      res.status(500);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.status(400);
      res.json({ "error" : "해당 아이디가 없습니다." });
    }else{
      chatlist.find({ _id : group_id }, function(err, docs){
        if(err){
          res.status(500);
          res.json({ "error" : "DB 에러입니다." });
        }else if(docs.length == 0){
          res.status(400);
          res.json({ "error" : "메세지를 입력할 해당 그룹이 없습니다." });
        }else{
          // chatlist.find({ member : body.userid }, function(err, docs){
          //   if(err){
          //     res.status(500);
          //     res.json({ "error" : "DB 에러입니다." });
          //   }else if(docs.length == 0){
          //     res.status(400);
          //     res.json({ "error" : "해당 아이디가 이 그룹에 없습니다." });
          //   }else{
          var inputs = {
            userid : body.userid,
            name : docs[0].name,
            groupid : group_id,
            message : body.message,
            date : new Date()
          };
          chatmessage.insert(inputs, function(err, docs){
            if(err){
              res.status(500);
              res.json({ "error" : "DB 에러입니다." });
            }else{
              res.status(200);
              res.json({ "result" : "그룹에 메세지 정상 입력." });
            }
          });
          //       }
          //     });
        }
      });
    }
  });
});
//해당 그룹아이디의 그룹의 구성원 목록을 받음
router.get('/member/:group_id',function(req,res,next) {
  var group_id = req.params.group_id;
  //이 그룹아이디를 _id로 하는 것을 chatlist DB에서 하나만 찾음
  chatlist.find({ _id : group_id },function(err,docs) {
    if(err){
      res.status(500);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.status(400);
      res.json({ "error" : "해당 그룹의 구성원이 없습니다." });
    }else{
      res.status(200);
      res.json(docs);
    }
  });
});
//해당 그룹 아이디의 그룹에 구성원을 추가함
router.post('/member/:group_id',function(req,res,next){
  var body = req.body;
  var group_id = req.params.group_id;
  var user_id = body.userid;

  users.find({ _id : body.userid }, function(err, docs){
    if(err){
      res.status(500);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.status(400);
      res.json({ "error" : "존재하지 않는 아이디입니다." });
    }else{
      chatlist.findOne({ _id : group_id }, function(err, doc){
        if(err){
          res.status(500);
          res.json({ "error" : "DB 에러입니다." });
        }
        // else if(doc.length == 0){
        //   res.status(400);
        //   res.json({ "error" : "해당 그룹이 없습니다." });
        // }
        else{
          //console.log(doc.length);
          //위에서 findOne 이 아닌 find 하면 푸시에서 오류남 왜?
          doc.member.push(user_id);

          chatlist.update({ _id : group_id }, doc ,{ }, function(err,numReplaced){
            if(err){
              res.status(500);
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
//해당 그룹아이디의 그룹에서 구성원을 지움
router.delete('/member/:group_id',function(req,res,next){
  var body = req.body;
  var group_id = req.params.group_id;
  var user_id = body.userid;

  users.find({ _id : body.userid }, function(err, docs){
    if(err){
      res.status(500);
      res.json({ "error" : "DB 에러입니다." });
    }else if(docs.length == 0){
      res.status(400);
      res.json({ "error" : "존재하지 않는 아이디입니다." });
    }else{
      chatlist.findOne({ _id : group_id }, function(err, doc){
        if(err){
          res.status(500);
          res.json({ "error" : "DB 에러입니다." });
        }else{
          for(var i=0;i<doc.member.length;i++){
            if(doc.member[i] == user_id){
              doc.member.splice(i,1);
              break;
            }
          }
          //업데이트가 아니라 계속 추가된느듯??
          chatlist.update({ _id : group_id }, doc ,{ }, function(err,numReplaced){
            if(err){
              res.status(500);
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

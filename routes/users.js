var express = require('express');
var router = express.Router();
var users = db['users'];
var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

/* GET users listing. */
router.get('/', function(req, res, next) {
});

router.post('/login', function(req, res, next){
  var session = req.session;
  var body = req.body;

  if( !body.hasOwnProperty("email") || !body.hasOwnProperty("password") || !regex.test(body.email)){
    res.json({ "error" : "데이터 입력이 잘못되었습니다."});
    return;
  }

  var inputs = {
    email : body.email,
    password : body.password
  };
  users.find(inputs, function(err, docs){
    if(err){
    }else{
      if(docs.length == 0){
        res.json({"error" : "없는 이메일이거나 비밀번호가 틀렸습니다"});
      }else{
        res.json({"result" : "로그인이 성공했습니다."});
      }
    }
  });
});

router.post('/logout', function(req, res, next){
});

router.post('/signup', function(req, res, next){
  var body = req.body;

  if( !body.hasOwnProperty("name") || !body.hasOwnProperty("email") || !body.hasOwnProperty("password") || !regex.test(body.email)){
    res.json({ "error" : "데이터 입력이 잘못되었습니다."});
    return;
  }

  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  users.find({ "email" : email }, function(err,doc){
    if(err){
    }else{
      if(doc.length == 0){
        var user = {
          "name" : name,
          "email" : email,
          "password" : password
        };

        users.insert(user,function(err,docs){
          if(err){
          }else{
            res.json({"result" : "가입이 완료되었습니다."});
          }
        });

      }else{
        res.json({"error" : "이미 사용중인 이메일주소입니다."});
      }
    }
  });
});

module.exports = router;

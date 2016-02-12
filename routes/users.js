var express = require('express');
var router = express.Router();
var users = db['users'];

/* GET users listing. */
router.get('/', function(req, res, next) {
});

router.post('/login', function(req, res, next){
  var session = req.session;
  var body = req.body;
  var inputs = {
    email : body.email,
    name : body.name,
    password : body.password
  };
  users.find(inputs, function(err, docs){
    if(err){
      res.json({
        error : err,
        results : null
      });
    }else{
      res.json({
        error : null,
        results : docs
      });
    }
  });
});

router.post('/logout', function(req, res, next){
});

router.post('/signup', function(req, res, next){
  var body = req.body;

  if( !body.hasOwnProperty("name") || !body.hasOwnProperty("email") || !body.hasOwnProperty("password")){
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

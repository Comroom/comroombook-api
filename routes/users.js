var express = require('express');
var router = express.Router();
var users = db['users'];
// var loginOut = db['loginOut'];
var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

/* GET users listing. */
router.get('/', function(req, res, next) {
  //이렇게 find 에서 {}는 전체를 지정, {"password" : 0} 처럼 0지정이면 안보겠다는 의미, 1이면 보겠다는 의미
  users.find({},{"password" : 0},function(err,docs){
    if(err){
      res.status(400);
      res.json({"error" : "DB 에러"});
    }else{
      res.status(200);
      res.json(docs);
    }
  });
});

//login part
router.post('/login', function(req, res, next){
  var session = req.session;
  var body = req.body;

  if( !body.hasOwnProperty("email") || !body.hasOwnProperty("password")
      || !regex.test(body.email)){
    res.status(400);
    res.json({ "error" : "데이터 입력이 잘못되었습니다."});
    return;
  }

  var inputs = {
    email : body.email,
    password : body.password
  };
  users.find(inputs, function(err, docs){
    if(err){
      res.status(400);
      res.json({"error" : "DB 에러"});
    }else{
      if(docs.length == 0){
        res.status(400);
        res.json({"error" : "없는 이메일이거나 비밀번호가 틀렸습니다"});
      // }else if(loginOut.find(inputs)){
      //   res.json({ "result" : "이미 로그인 되어 있습니다."});
      }else{
        res.status(200);
        res.json({"result" : "로그인이 성공했습니다."});
        // loginOut.insert(inputs);
      }
    }
  });
});

//logout part
router.post('/logout', function(req, res, next){
  // var session = req.session;
  // var body = req.body;
  //
  // var inputs = {
  //   email : body.email,
  //   password : body.password
  // };
  // loginOut.find(inputs, function(err, docs){
  //   if(err){
  //   // }else if(docs.length == 0){
  //   //   res.json({ "result" : "이미 로그아웃 되어있습니다."});
  //   }else{
  //     res.json({ "result" : "성공적으로 로그아웃 하였습니다."});
  //     // loginOut.remove(inputs);
  //   }
  // });
});

router.post('/signup', function(req, res, next){
  var body = req.body;
  //이름값, 이메일값, 패스워드 값이 없는 경우와 이메일의 형식에 맞지 않는 경우
  if( !body.hasOwnProperty("name") || !body.hasOwnProperty("email")
      || !body.hasOwnProperty("password") || !regex.test(body.email)){
    res.status(400);
    res.json({ "error" : "데이터 입력이 잘못되었습니다."});
    return;
  }
  //위에서 이름하고 패스워드를 입력안해도("") 성공하는 경우를 방지하기 위해
  if(body.name == "" || body.email == "" || body.password == ""){
    res.status(400);
    res.json({ "error" : "이름 혹은 비밀번호 혹은 이메일이 입력되지 않았습니다."});
    return;
  }

  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  users.find({ "email" : email }, function(err,doc){
    //디비에서 찾다가
    if(err){
      //그 와중에 에러 나면 여기
      res.status(400);
      res.json({"error" : "DB 에러"});
    }else{
      //에러 안나면 여기
      if(doc.length == 0){
        //에러 안나고 디비안에 해당 이메일 데이터가 없을때 여기
        var user = {
          "name" : name,
          "email" : email,
          "password" : password
        };

        users.insert(user,function(err,docs){
          if(err){
            res.status(400);
            res.json({"error" : "DB 에러"});
          }else{
            res.status(200);
            res.json({"result" : "가입이 완료되었습니다."});
          }
        });

      }else{
        //디비에서 해당 이메일 데이터가 있으면 여기
        res.status(400);
        res.json({"error" : "이미 사용중인 이메일주소입니다."});
      }
    }
  });
});

module.exports = router;

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
});

module.exports = router;

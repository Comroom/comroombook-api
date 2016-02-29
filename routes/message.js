var express = require('express');
var router = express.Router();

var message = db['message'];
var user = db['user'];

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

router.post('/',function(req,res,next){

});

module.exports = router;

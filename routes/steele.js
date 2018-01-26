var express = require('express');
var redis = require("redis"),
    client = redis.createClient();

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('steele', { title: 'Joshua Steele' });
});

/* POST data to the Redis backend */
router.post('/', function(req, res, next) {
  setData(req);
});

/*
 Function to store the data
*/
function setData(req) {
  var milliseconds = (new Date).getTime();

  var key = req.body.key;
  var _data = req.body.data;
  
  client.hset('steele::'+key, milliseconds, _data, redis.print);

}

module.exports = router;

var express = require('express');
var redis = require("redis"),
    client = redis.createClient();

var router = express.Router();

router.get('/compare', function(req, res, next) {
  res.render('compare', { title: 'Compare' });
});

router.get('/align', function(req, res, next) {
  res.render('align', { title: 'Time Differences' });
});

router.get('/pause', function(req, res, next) {
  res.render('pause', { title: 'Listen to Pauses' });
});

/* GET home page. */
router.get('/:id', function(req, res, next) {
  let title = '';
  if (req.params.id == "garrick" ) {
    title = "David Garrick";
  } else if (req.params.id == "fitzpatrick" ) {
    title = "Thaddeus Fitzpatrick";
  } else if (req.params.id == "steele" ) {
    title = "Joshua Steele";
  }
  res.render('fitzpatrick', { title: title, data: req.params.id });
});

/* POST data to the Redis backend */
router.post('/:id', function(req, res, next) {
  setData(req);
  res.statusCode = 200;
});

/*
 Function to store the data
*/
function setData(req) {
  var milliseconds = (new Date).getTime();
  var _id = req.params.id;
  var key = req.body.key;
  var _data = req.body.data;
  var _type = req.body._type;
  
  client.hset(_id + '::' + key, _type + milliseconds, _data, redis.print);

}

module.exports = router;

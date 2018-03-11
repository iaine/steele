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
});

// fake endpoint to test the data export
router.get('/data/:type', function(req,res, next) {
res.set('Content-Type', 'application/xml');
var xml = '<dso>';
xml += '<head><publication type="'+ req.params.type +'"/></head>';
if (req.params.type == 'collection') {
  xml += '<body>' + fakeCollection() + '</body>';
} else {
  xml += '<body>' + fakeAggregation() + '</body>';
}
xml += '</dso>';
res.send(xml);
});

function fakeCollection() {
  return '<part id="1"><note freq="440" dur="0.3" vol="0.5" /><note freq="441" dur="0.3" vol="0.6" /></part>' +
         '<part id="2"><note freq="440" dur="0.3" vol="0.5" /><note freq="230" dur="0.2" vol="0.5" /></part>';
}

function fakeAggregation() {
  return '<part id="1"><note freq="440.5555" dur="0.3" vol="0.55" /><note freq="330.08" dur="0.25" vol="0.6" /></part>';
}

/*
 Function to store the data
*/
function setData(req) {
  var milliseconds = (new Date).getTime();

  var key = req.body.key;
  var _data = req.body.data;
  
  client.hset('fitzpatrick::'+key, milliseconds, _data, redis.print);

}

module.exports = router;

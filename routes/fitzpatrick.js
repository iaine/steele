var express = require('express');
var redis = require("redis"),
    client = redis.createClient();

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('fitzpatrick', { title: 'Thomas Fitzpatrick' });
});

/* POST data to the Redis backend */
router.post('/', function(req, res, next) {
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

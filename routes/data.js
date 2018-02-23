var express = require('express');
var steele = require('../public/steele.json')
var fitzpatrick = require('../public/fitzpatrick.json')
var garrick = require('../public/garrick.json')
var fs = require("fs");

var router = express.Router();

/* GET home page. */
/*router.get('/steele', function(req, res, next) {
  res.send(steele);
});*/

/* GET fitzpatrick */
/*router.get('/fitzpatrick', function(req, res, next) {
  res.send(fitzpatrick);
}); */

/* GET fitzpatrick */
router.get('/:id', function(req, res, next) {
  switch(req.params.id) {
    case 'garrick':
      res.send(garrick);
      break;
    case 'steele':
      res.send(garrick);
      break;
    case 'fitzpatrick':
      res.send(garrick);
      break;  
    default:
      break;
  }
  res.send(req.params.id);
});

/* GET AS page */
router.get('/as/:id', function(req, res, next) {
  var contents = fs.readFileSync("public/as/" + req.params.id + ".as");
  res.send(contents);
});

module.exports = router;

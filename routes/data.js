var express = require('express');
var steele = require('../public/steele.json')
var fitzpatrick = require('../public/fitzpatrick.json')
var fs = require("fs");

var router = express.Router();

/* GET home page. */
router.get('/steele', function(req, res, next) {
  res.send(steele);
});

/* GET fitzpatrick */
router.get('/fitzpatrick', function(req, res, next) {
  res.send(fitzpatrick);
});

/* GET AS page */
router.get('/as/:id', function(req, res, next) {
  var contents = fs.readFileSync("public/as/" + req.params.id + ".as");
  res.send(contents);
});

module.exports = router;

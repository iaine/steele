var express = require('express');
var steele = require('../public/steele.json')
var fitzpatrick = require('../public/fitzpatrick.json')
var garrick = require('../public/garrick.json')
var fs = require("fs");

var router = express.Router();

/* test compare page */
router.get('/compare', function(req, res, next) {
  let A = new Array();
  let B = new Array(); 
  let a = steele;
  let b = garrick;

  var diffs = Array();
  buildSymbolTable(a.rows, A);
  buildSymbolTable(b.rows, B);
  console.log('A ' + A.length + ' B ' + B.length);
  let master = new Array();
  alignSymbolLists(A, B, master);
  createDifference(master);
  console.log(diffs);
  res.send("<p>Hello</p>");
});

/* GET fitzpatrick */
router.get('/:id', function(req, res, next) {
  switch(req.params.id) {
    case 'garrick':
      res.send(garrick);
      break;
    case 'steele':
      res.send(steele);
      break;
    case 'fitzpatrick':
      res.send(fitzpatrick);
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

/* test compare page */
router.get('/compare', function(req, res, next) {
  let Symbol = buildSymbolTable(steele, garrick);
  console.log("Symbol table");
  console.log(contents);
  res.send("<p>Hello</p>");
});

var buildSymbolTable = function(witness, symbol) {
  let len = witness.length;

  witness.forEach(function(c) {
    if (isPause(c.pitch)) {
       symbol.push({'symbol': 'pause', 'data': c});
    } else {
       symbol.push({'symbol': 'note', 'data': c});
    }
  });
}

var alignSymbolLists = function(witness, test, master) {
  let n = witness.length;
  let m = test.length;
  
  //todo handle n or m being longer
  if (n > 0 && m >0 ) {
     //for (let i = 0;i< n;i++) {
       //for (let j = 0; j<m;m++) {
         if (witness[0].symbol == test[0].symbol) {
           master.push({'symbol': '', 'witness': witness[0].data, 'test': test[0].data});
           alignSymbolLists(witness.slice(1), test.slice(1), master);
         } else if (witness[0].symbol != test[0].symbol) {
            master.push({'symbol': 'change', 'witness': '', 'test': test[0].data});
            alignSymbolLists(witness.slice(1), test.slice(2), master);
        }
       //}
     //}
   } else if (n>0 && m == 0) {
     master.push({'symbol': 'delete', 'witness': witness, 'test':'' });
   } else if (m>0 && n == 0) {
     master.push({'symbol': 'delete', 'witness': '', 'test':test });
   }
}

var createDifference = function(aligned_list) {
    aligned_list.forEach(function(d) {
        let _tmp = Array();
        let keys = Reflect.ownKeys(d.witness);
         keys.forEach(function(a) {
            console.log("key: " + a);
             _tmp.push({a : (d.witness.a - d.test.a)});
         });
         diffs.push(_tmp);
    });
}

function isPause(freq) {
   return (freq < 50.0) ? true: false;
}

module.exports = router;

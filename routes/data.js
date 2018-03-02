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
  buildSymbolTable(a.rows, A);
  buildSymbolTable(b.rows, B);
  console.log('A ' + A.length + ' B ' + B.length);
  let master = new Array();
  alignSymbolLists(A, B, master);
  console.log(master);
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
  /*let n = witness.length;
  let m = test.length;
 
   
  if (n > 0 && m > 0) {
    console.log('n ' + n + ' b ' + m);
    if (witness[1] == test[1]) {
      symbol.add({'symbol':'', 'a':witness[n],'b':test[m]});
      console.log('a' + witness[n] + ' b ' + test[m]);
      
      buildSymbolTable(witness.slice(1), test.slice(1), symbol);
    } else {
      //we assume that there is a change here
      symbol.add({'symbol':'change', 'a':witness[n],'b':test[m]});
      buildSymbolTable(witness.slice(1), test.slice(1), symbol);
    }
  } else if (n > 0) {
    symbol.add({'symbol':'delete', 'a': witness[n],'b':""});
  } else {
    symbol.add({'symbol':'add', 'a':'','b':test[m]});
  }*/
}

var alignSymbolLists = function(witness, test, master) {
  let n = witness.length;
  let m = test.length;
  
  //todo handle n or m being longer
  if (n > 0 && m >0 ) {
     //for (let i = 0;i< n;i++) {
       //for (let j = 0; j<m;m++) {
         if (witness[0].symbol == test[0].symbol) {
           master.push({'symbol': '', 'witness': witness[0], 'test': test[0]});
           alignSymbolLists(witness.slice(1), test.slice(1), master);
         } else if (witness[0].symbol != test[0].symbol) {
            master.push({'symbol': 'change', 'witness': '', 'test': test[0]});
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

function isPause(freq) {
   return (freq < 50.0) ? true: false;
}

module.exports = router;

var express = require('express');
var steele = require('../public/steele.json')
var fitzpatrick = require('../public/fitzpatrick.json')
var garrick = require('../public/garrick.json')
var fs = require("fs");

var router = express.Router();
var alignid;
/* test compare page */
router.get('/compare', function(req, res, next) {
  let A = new Array();
  let B = new Array(); 
  let a = steele;
  let b = garrick;
  alignid = 0;
  var diffs = Array();
  buildSymbolTable(a.rows, A);
  buildSymbolTable(b.rows, B);

  let master = new Array();
  alignSymbolLists(A, B, master);
  createDifference(master, diffs);
  
  res.send(master);
});

/* test compare page */
router.get('/align', function(req, res, next) {
  let A = new Array();
  let B = new Array();
  let a = steele;
  let b = garrick;
  alignid = 0;
  var diffs = Array();
  buildSymbolTable(a.rows, A);
  buildSymbolTable(b.rows, B);
  console.log('A ' + A.length + ' B ' + B.length);
  let master = new Array();
  alignSymbolLists(A, B, master);
  createDifference(master, diffs);
  console.log(diffs);
  res.send(diffs);
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
           master.push({'symbol': '', 'id': alignid++, 'witness': witness[0].data, 'test': test[0].data});
           alignSymbolLists(witness.slice(1), test.slice(1), master);
         } else if (witness[0].symbol != test[0].symbol) {
            master.push({'symbol': 'change','id': alignid++, 'witness': witness[0].data, 'test': test[0].data});
            alignSymbolLists(witness, test.slice(1), master);
        }
       //}
     //}
   } else if (n>0 && m == 0) {
     console.log('m ' + m + ' n ' + n);
     master.push({'symbol': 'delete', 'id': alignid++, 'witness': witness, 'test':'' });
     alignSymbolLists(witness.slice(1), test, master);
   } else if (m>0 && n == 0) {
     console.log('m ' + m + ' n ' + n);
     master.push({'symbol': 'add', 'id': alignid++, 'witness': '', 'test':test });
     alignSymbolLists(witness, test.slice(1), master);
   }
}

var createDifference = function(aligned_list, diffs) {
    aligned_list.forEach(function(d) {
        let _tmp = {};
        if(d.witness != '') {
        let keys = Reflect.ownKeys(d.witness);
         keys.forEach(function(a) {
            //console.log("key: " + a);
            if (a != 'id') {
             _tmp[a] = (d.witness[a] - d.test[a]);
           } else {
             _tmp[a] = d.witness[a];
           }
         });
         let _t = JSON.stringify(_tmp);
         diffs.push(_t); 
        } else {
        let keys = Reflect.ownKeys(d.test);
         keys.forEach(function(a) {
           if (a != 'id') {
             _tmp[a] = (0 - d.test[a]);
           } else {
             _tmp[a] = d.test[a];
           }
         });
         let _t = JSON.stringify(_tmp);
         diffs.push(_t);    
        }
        console.log("Diffs");
       // console.log(diffs);
	});
}

function isPause(freq) {
   return (freq < 50.0) ? true: false;
}

module.exports = router;

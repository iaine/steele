/**
*  Alignment and Colattion algorithms
*/

var Symbol = new Set();

var buildSymbolTable = function(witness, test) {
  let n = witness.length;
  let m = test.length;

  if (n > 0 && m > 0) {
    if (witness[n] == test[m]) {
      Symbol.push('symbol':'', 'a':witness[n],'b':test[m]);
      buildSymbolTable(witness.slice(witness[n]), test.slice(test[m]));
    } else {
      //we assume that there is a change here
      Symbol.push('symbol':'change', 'a':witness[n],'b':test[m]);
      buildSymbolTable(witness.slice(witness[n]), test.slice(test[++m]));
    }
  } else (n > 0) {
    Symbol.push('symbol':'delete', 'a': witness[n],'b':"");
  } else {
    Symbol.push('symbol':'add', 'a':'','b':test[m]);
  }
}

//pauses are less than 50 hertz
var isPause = function (x) { return (x.note < 50) ? true: false; };



var properties = [];

var _gain = 0.5;

//set listeners for tags
var volup = document.getElementById("volup");
var voldown = document.getElementById("voldown");

//set listeners for tags
var tup = document.getElementById("timeup");
var tdown = document.getElementById("timedown");

volup.addEventListener("touchstart", handleVolUp, false);
volup.addEventListener("mouseenter", handleVolUp, false)
voldown.addEventListener("touchstart", handleVolDown, false);


//time details
var _time = 1;
tup.addEventListener("mouseenter", handleTimeUp, false);
tdown.addEventListener("mouseenter", handleTimeDown, false);

//initialise the model
var _model = Array();

function handleTimeUp() {
   _time += 0.1;
}

function handleTimeDown() {
   if (_time > 0) {
      _time -= 0.1;
   }
}

function handleVolUp() {
   if (_gain < 1) {
      _gain += 0.1;
   }
   console.log("Gain was " + _gain);
   console.log(_model);
   postData(_model);
}

function handleVolDown() {
   if (_gain > 0) {
      _gain -= 0.1;
   }
}

function postData(data) {
  $.post('/steele', {"key": "fakekey", "data": JSON.stringify(data)});
}

function get_as() {
$.ajax({url: "data/as/steele",  success: function( data ) {
var tmp = data.split("\n\n");
var _tmp = tmp[0].split("\n");

//parser for rules
_tmp.forEach( function(datum) {
    if (datum) {
      var _tmp_itm = datum.split(" {");
      var _tmp_val = _tmp_itm[1].split(";");
      var audio = []
      for (var i in _tmp_val) {
        if (_tmp_val[i] != '}') {
          var spl = _tmp_val[i].split(':');
          audio[spl[0].trim()] = spl[1];
        }
      }
      properties[_tmp_itm[0]] = audio;
    }
 });
} });
}

function play () {

get_as(properties);

$.ajax({url: "data/steele", success: function( data ) {
  var notes = data.rows;

   window.AudioContext = window.AudioContext || window.webkitAudioContext;
   var frequency;
   //var source;

   var audioCtx = new AudioContext();
   //var _gain = 0.5; //set gain in the middle
   // create Oscillator node
  var _old = 0;
 
   for (var i in notes) {
   //length is a rule
   if (notes[i].value[0] > 10) {
     function calculate_note(j) {
         var _get_time = function(timeType) {
             switch(timeType) {
               case "t":
                 return _time * 0.333;
                 break;
               case "d":
                 return _time * 0.5;
                 break;  
               case "q":
                 return _time * 0.25;
                 break;
               default:
                 return 1;
                 break;
             }
         }
   
         var _type = notes[i].value[1]; //type is the second value in the array
         
         if (properties[_type].qtr != 0) {
           vol = notes[i].value[2]; //loud is the final slice
           qtr = properties[_type].qtr; //half the quarter notes into halves
           var make_note = function(j,k) {
               _old++;
               note = new Note();
               note.start(audioCtx, _tmp_n(j, k), 1, vol, _old, _get_time(notes[i].value[3]));
           }
             //if k was type for rising; then 3 else -3
             var _tmp_n = function (j, k) {
               return j * Math.pow(1.059463094359,k);
             }

           if (_type == 'thirddown' || _type == 'seconddown') {
            for (k = 0; k > qtr; k--) {
              console.log('id' + k);
              setTimeout(make_note(j, k), 300);
            }
           } else {
            for (k = 1; k <= qtr; k++) {
              // internal timer
              setTimeout(make_note(j, k), 300);
            }
          }
        } else {
            //Note doesn't increase.  
            //Assumption is that the note doesn't change volume. 
            note = new Note();
            note.start(audioCtx,j, 1, 0, _old, _get_time(notes[i].value[3]));
        } 
     }

         calculate_note(notes[i].value[0]);
   } else {
      // if empty pause for quarter of a second
      setTimeout(function() {console.log("pausing for a breath")}, 1000);
   }
  };
}
});
};

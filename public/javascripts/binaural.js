var properties = [];

var _gain = 0.5;

//set listeners for tags
var volup = document.getElementById("volup");
var voldown = document.getElementById("voldown");

//set listeners for tags
var tup = document.getElementById("timeup");
var tdown = document.getElementById("timedown");

volup.addEventListener("touchstart", handleVolUp, false);
volup.addEventListener("click", handleVolUp, false)
voldown.addEventListener("touchstart", handleVolDown, false);
voldown.addEventListener("click", handleVolDown, false)

//time details
var _time = 1;
tup.addEventListener("click", handleTimeUp, false);
tdown.addEventListener("click", handleTimeDown, false);

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

//using the decibel calculation for volume
function handleVolUp() {
   if (_gain < 1) {
      //volume(dB) = 20 log10 (a1 / a0)
      _gain = 20 * Math.log10(_gain / (_gain + 0.1));
   }
   console.log("Gain was " + _gain);
   //console.log(_model);
   //postData(_model);
}

function handleVolDown() {
   if (_gain > 0) {
      //volume(dB) = 20 log10 (a1 / a0)
      _gain = 20 * Math.log10(_gain / (_gain - 0.1));
   }
}

function postData(data) {
  $.post('/steele', {"key": "fakekey", "data": JSON.stringify(data)});
}


function play (datafile) {


$.ajax({url: '/data/compare', success: function( data ) {
  var notes = data;
  console.log(notes);
   var audioCtx = new AudioContext(); 
   notes.forEach(function (i) {
      note = new Note();
      //frequency, note_length, volume, id
      //@todo fix the rate change
      note.altnote(audioCtx, i.witness, i.test, i.id);
   });
 
}}); //end function
};

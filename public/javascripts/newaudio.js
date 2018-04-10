
var properties = [];

var _gain = 0.5;

var _type = '';

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
var _prov = Array();

function handleTimeUp() {
   _time += 0.1;
}

function handleTimeDown() {
   if (_time > 0) {
      _time -= 0.1;
   }
}

function createAnnotation(annoType, annoValue) {
  $.post("http://127.0.0.1:3000/prov/comment", {"data": makeAnnotationBody(annoType, annoValue)} );
}

function makeAnnotationBody(annoType, annoValue) {
return  JSON.stringify({ "@context": "http://www.w3.org/ns/anno.jsonld", "id": "http://example.org/anno5", "type": "Annotation","created": new Date().toISOString(), "body": {"type" : annoType,"value" : annoValue,"format" : "text/plain"},"target": "http://127.0.0.1/sonify/"+_type });
}

//using the decibel calculation for volume
function handleVolUp() {
   //if (_gain < 1) {
      //volume(dB) = 20 log10 (a1 / a0)
      _gain = 20 * Math.log10((_gain + 0.1) / _gain);
      createAnnotation("volume", _gain);
   //}
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

function postData(endpoint, provdata, _type) {
  console.log('posting');
  $.post(endpoint, {"type": _type, "key": "fake", "data": JSON.stringify(provdata)});
}

function play (datafile) {
_type = datafile;
//make generic so we can re-use for comments
let urltype = '';
if (datafile == "garrick")
{
  urltype = "../data/garrick";
} else if (datafile == "steele")
{
  urltype = "../data/steele";
} else {
  urltype = "../data/fitzpatrick";
}

var notes = Array();
$.ajax({url: urltype, success: function( data ) {
  notes = data.rows;
  
   //window.AudioContext = window.AudioContext || window.webkitAudioContext;

   var audioCtx = new AudioContext(); 
   notes.forEach(function (i) {
      note = new Note();
      //frequency, note_length, volume, id
      //@todo fix the rate change
      note.start(audioCtx, i.pitch, i.duration, i.volume, i.id);
   });
   console.log(_model);
   //store the model of the notes
   postData(datafile, _model, 'notes');
   postData('../prov/'+datafile, datafile, '');
}}); //end function


};

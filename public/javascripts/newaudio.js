
var properties = [];

var _gain = 0.5;

//set type for the annotation
var _type = '';

//store the session key
var session = '';

//used to number the identity
var commentid = 1;
var id = 0;

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
  let _n = commentid++;
return  JSON.stringify({ "@context": "http://www.w3.org/ns/anno.jsonld", "creator": "http://example.org/" + session, "id": "http://example.org/anno" + _n, "type": "Annotation","created": new Date().toISOString(), "body": {"type" : annoType,"value" : annoValue,"format" : "text/plain"},"target": [ "http://127.0.0.1/sonify/"+_type, './prov/'+session+'/model'+ _n] });
}

//using the decibel calculation for volume
function handleVolUp() {
   _gain = 20 * Math.log10((_gain + 0.1) / _gain);
   createAnnotation("volume", _gain);
   postData('../prov/model', {"data":_model, "id": (commentid-1)});
}

function handleVolDown() {
   if (_gain > 0) {
      //volume(dB) = 20 log10 (a1 / a0)
      _gain = 20 * Math.log10(_gain / (_gain - 0.1));
   }
}

function postData(endpoint, provdata) {
  $.post(endpoint, {"key": session, "data": JSON.stringify(provdata)});
}

function play (datafile, sessionid) {
_type = datafile;
session = sessionid;
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
   //store the model of the notes
   postData('../prov/model', {"data":_model, "id": id});
   postData('../prov/'+datafile, {"data":datafile, "id": id});
}}); //end function


};

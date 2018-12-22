var _gain = 0.5;

//initialise the model
var _model = Array();

function play (datafile) {


$.ajax({url: '/data/compare', success: function( data ) {
  var notes = data;
  console.log(notes);
   var audioCtx = new AudioContext(); 
   notes.forEach(function (i) {
      note = new Note();
      //frequency, note_length, volume, id
      //@todo fix the rate change
      note.pausenote(audioCtx, i.witness, i.test, i.id);
   });
 
}}); //end function
};

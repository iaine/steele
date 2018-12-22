var _gain = 0.5;

//initialise the model
var _model = Array();

function postData(data) {
  $.post('/steele', {"key": "fakekey", "data": JSON.stringify(data)});
}


function play (datafile) {


$.ajax({url: '../data/compare', success: function( data ) {
  var notes = data;
  console.log(notes);
   var audioCtx = new AudioContext(); 
   notes.forEach(function (i) {
      console.log(i);
      note = new Note();
      //frequency, note_length, volume, id
      //@todo fix the rate change
      note.altnote(audioCtx, i.witness, i.test, i.id);
   });
 
}}); //end function
};

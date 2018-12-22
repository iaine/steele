var _gain = 0.5;

//initialise the model
var _model = Array();

function postData(data) {
  $.post('/steele', {"key": "fakekey", "data": JSON.stringify(data)});
}


function play (datafile) {


$.ajax({url: '../data/align', success: function( data ) {
  var notes = data;
  console.log(notes);
   var audioCtx = new AudioContext(); 
   notes.forEach(function (i) {
      note = new Note();
      //frequency, note_length, volume, id
      //@todo fix the rate change
      let _vol = (i["duration"] == 0)? 0.1 : 0.5;
      let pitch = (i["pitch"] == 0)? 41.25 : i.pitch;
      console.log('Align');
      console.log(i);
      console.log(_vol);
      console.log(i["pitch"]);
      console.log(pitch);
      note.start(audioCtx, pitch, (1.0 + i.duration), _vol, i.id);
   });
 
}}); //end function
};

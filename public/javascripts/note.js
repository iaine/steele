  var Note = function() {

    function Note() {
        this.oscillators = Array();
    }

    // Start single note
    function start(audioCtx, frequency, note_length, volume, id) {
      let oscillator = audioCtx.createOscillator();
      let gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
      gainNode.gain.setValueAtTime(volume, id);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, id);
      oscillator.start(id);
      
      oscillator.stop(id + (0.001 + note_length));
      oscillator.connect(audioCtx.destination);
    };

    // Play two notes
    function altnote(context, witness, test) {
      oscillatorL = context.createOscillator();
      console.log(witness);
      oscillatorL.frequency.value = witness['pitch'];
      oscillatorR = context.createOscillator();
      oscillatorR.frequency.value = test['pitch'];
      mergerNode = context.createChannelMerger(2); //create mergerNode with 2 inputs
      mergerNode.connect(context.destination);

      oscillatorL.connect(mergerNode, 0, 0);
      //connect output #0 of the oscillator to input #0 of the mergerNode
      oscillatorR.connect(mergerNode, 0, 1);
      //connect output #0 of the oscillator to input #1 of the mergerNode

      oscillatorL.start(witness['id']);
      oscillatorL.stop(witness['id'] + witness['duration']); //stop "left" tone after 2 s
      oscillatorR.start(test['id']);
      oscillatorR.stop(test['id']+test['duration']);
    };

    return {
        start:start, 
        altnote:altnote
    }
  };

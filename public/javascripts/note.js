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
    function altnote(context, witness, test, alignid) {
 
      oscillatorL = context.createOscillator();
      
      oscillatorL.frequency.setValueAtTime(witness['pitch'], alignid);
      oscillatorL.frequency.exponentialRampToValueAtTime(witness['pitch'], context.currentTime + 0.03);
      oscillatorR = context.createOscillator();
      oscillatorR.frequency.setValueAtTime(test['pitch'], alignid);
      oscillatorR.frequency.exponentialRampToValueAtTime(test['pitch'], context.currentTime + 0.03);
      mergerNode = context.createChannelMerger(2); //create mergerNode with 2 inputs
      mergerNode.connect(context.destination);

      oscillatorL.connect(mergerNode, 0, 0);
      //connect output #0 of the oscillator to input #0 of the mergerNode
      oscillatorR.connect(mergerNode, 0, 1);
      //connect output #0 of the oscillator to input #1 of the mergerNode

      oscillatorL.start(alignid);
      oscillatorL.stop(alignid + witness['duration']);
      oscillatorR.start(alignid);
      oscillatorR.stop(alignid + test['duration']);
      
    };

    return {
        start:start, 
        altnote:altnote
    }
  };

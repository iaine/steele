  var Note = function() {

    function Note() {
        this.oscillators = Array();
        var oldr = 1;
        var oldl = 1;
    }

    // Start single note
    function start(audioCtx, frequency, note_length, volume, id, old) {
      let oscillator = audioCtx.createOscillator();
      
      //let osc2 = audioCtx.createOscillator();  
      console.log(old);
      
      let gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
      gainNode.gain.setValueAtTime(volume, id);
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, id);
      oscillator.frequency.exponentialRampToValueAtTime(frequency, audioCtx.currentTime + 0.03);
      old = frequency;
      oscillator.start(id);
      _model.push({'freq': frequency, 'gain': volume, 'duration': note_length, 'id':id  }); 
      oscillator.stop(id + note_length);

      /*osc2.frequency.setValueAtTime(2*frequency, id);
      osc2.frequency.exponentialRampToValueAtTime(2*frequency, audioCtx.currentTime + 0.03);
      osc2.start(id);
      _model.push({'freq': 2*frequency, 'gain': volume, 'duration': note_length, 'id':id  });
      osc2.stop(id + note_length);

      osc2.connect(audioCtx.destination);*/
      oscillator.connect(audioCtx.destination);
    };

    // Play two notes
    function altnote(context, witness, test, alignid) {
 
      oscillatorL = context.createOscillator();
      
      oscillatorL.frequency.setValueAtTime(this.oldl, alignid);
      oscillatorL.frequency.exponentialRampToValueAtTime(witness['pitch'], context.currentTime + 0.03);
      this.oldl = witness['pitch'];
      console.log("left old: " + this.oldl + " new " + witness['pitch']);
      oscillatorR = context.createOscillator();
      oscillatorR.frequency.setValueAtTime(this.oldr, alignid);
      oscillatorR.frequency.exponentialRampToValueAtTime(test['pitch'], context.currentTime + 0.03);
      this.oldr = test['pitch'];
      console.log("right old: " + this.oldr + " new " + test['pitch']);

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

    // Play two notes
    function pausenote(context, witness, test, alignid) {
      var witnesspause = 0;
      var testpause = 0;

      let volumeL = 0;
      let volumeR = 0;

      if (witness.pitch < 50.0){
         witnesspause =  230.0;
         volumeL = 0.5; 
      }else {
         witnesspause =  witness.pitch;
         //witnesspause =  100.0;
         volumeL = 0.1;
      }

      if (test.pitch < 50.0){
         testpause =  230.0;
         volumeR = 0.5;     
      }else { 
         testpause =  test.pitch;
         //test.pitch = 100.0;
         volumeR = 0.1;
      }
      var testpause = (test.pitch < 50.0)? 230.0 : test.pitch;

      let gainNodeL = context.createGain();
      gainNodeL.connect(context.destination);
      gainNodeL.gain.setValueAtTime(volumeL, alignid);

      let gainNodeR = context.createGain();
      gainNodeR.connect(context.destination);
      gainNodeR.gain.setValueAtTime(volumeR, alignid);

      console.log('test ' + witnesspause + ' witness ' + testpause);
      oscillatorL = context.createOscillator();
  
      oscillatorL.frequency.setValueAtTime(witnesspause, alignid);
      oscillatorL.frequency.exponentialRampToValueAtTime(witnesspause, context.currentTime + 0.03);

      oscillatorR = context.createOscillator();
      oscillatorR.frequency.setValueAtTime(testpause, alignid);
      oscillatorR.frequency.exponentialRampToValueAtTime(testpause, context.currentTime + 0.03);
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
        altnote:altnote, 
        pausenote:pausenote
    }
  };

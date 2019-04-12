  var Note = function() {

    function Note() {
        this.oscillators = Array();
        var oldr = 1;
        var oldl = 1;
    }

   /**
   *  ADSR function
   *  Usage:  let gainNode = adsr(id + 0.1 + 0.03, 0.01, 0.08, 0, 0, 0);
   *  Replaces using a GainNode on its own. 
   */
   
   function adsr (audioCtx, T, adsrEnv) {
        var gainNode = audioCtx.createGain();
        function set(v, t) { gainNode.gain.linearRampToValueAtTime(v, T + t); }
        set(0.0, -T);
        set(0.0, 0);
        set(1.0, adsrEnv['a']);
        set(adsrEnv['sustain'], adsrEnv['a'] + adsrEnv['d']);
        set(adsrEnv['sustain'], adsrEnv['a'] + adsrEnv['d'] + adsrEnv['s']);
        set(0.0, adsrEnv['a'] + adsrEnv['d'] + adsrEnv['s'] + adsrEnv['r']);
        return gainNode;
    }

    // Start single note
    function start(audioCtx, frequency, note_length, volume, id, old) {
      let oscillator = audioCtx.createOscillator();
      
      let _rampNote = (old)? old : frequency;
      console.log("pitch: " + frequency + "  ramp: " + _rampNote);

      let gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
      gainNode.gain.setValueAtTime(volume, id);
        
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, id);
      oscillator.frequency.exponentialRampToValueAtTime(_rampNote, id + 0.5);
    
      oscillator.start(id);
      _model.push({'freq': frequency, 'gain': volume, 'duration': note_length, 'id':id  }); 
      oscillator.stop(id + note_length);

      oscillator.connect(audioCtx.destination);
    };

    // Play two notes
    function altnote(context, witness, test, alignid) {
 
      oscillatorL = context.createOscillator();

      this.oldl = witness['pitch'];
      console.log("left old: " + this.oldl + " new " + witness['pitch']);

      this.oldr = test['pitch'];
      console.log("right old: " + this.oldr + " new " + test['pitch']);

      oscillatorL.frequency.setValueAtTime(this.oldl, alignid);
      oscillatorL.frequency.exponentialRampToValueAtTime(witness['pitch'], context.currentTime + 0.03);

      oscillatorR = context.createOscillator();
      oscillatorR.frequency.setValueAtTime(this.oldr, alignid);
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

    function playEnvelopeTone (audioContext, frequency, note_length, volume, adsrEnv, id, old) {


        let oscillator = audioContext.createOscillator();

        let _rampNote = (old)? old : frequency

        let gainNode = adsr(audioContext, id, adsrEnv);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, id);
        oscillator.frequency.exponentialRampToValueAtTime(_rampNote, id + 0.03);
        oscillator.start(id);
        oscillator.stop(id + note_length);

        //connect all the parts up now
        oscillator.connect(audioContext.destination);
        gainNode.connect(audioContext.destination);

    };

    return {
        start:start, 
        altnote:altnote, 
        pausenote:pausenote, 
        playEnvelopeTone:playEnvelopeTone
    }
  };

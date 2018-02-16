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
    function altnote(audioCtx, noteArr) {
      
      this.context = audioCtx;
 
      let id = noteArr.id;
      let oscillator1 = this.context.createOscillator();
      let gainNode = audioCtx.createGain();
      gainNode.gain.cancelScheduledValues(this.context.currentTime);
      gainNode.connect(audioCtx.destination);
      gainNode.gain.setValueAtTime(0.3, id)
      oscillator1.type = "triangle";
      oscillator1.frequency.setValueAtTime(50, id);
      oscillator1.start(id);
      oscillator1.connect(this.context.destination);
      oscillator1.stop(id + noteArr.duration);

      let oscillator2 = this.context.createOscillator();
      let gainNode2 = this.context.createGain();
      gainNode2.connect(this.context.destination);
      gainNode2.gain.cancelScheduledValues(this.context.currentTime);
      gainNode2.gain.setValueAtTime(0.3, (id+ this.context.currentTime));
      oscillator2.type = "sine";
      oscillator2.frequency.setValueAtTime(60, (id+ this.context.currentTime));
      //oscillator2.connect(this.context.destination);
      oscillator2.start((id+ this.context.currentTime));
      oscillator2.stop((id+ this.context.currentTime) + noteArr.duration);
    };

    return {
        start:start, 
        altnote:altnote
    }
  };

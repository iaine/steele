  var Note = function() {

      //this.frequency = frequency;
      //this.note_length = function(note_length) { return 1/note_length};
      //this.vol = _gain_note(loud);

    function setLength(duration) {
      return 1/duration;
    }

    function setGain(gain) {
      return (gain == '0') ? 0.5 : (gain + 0.1);
    }

    function start(audioCtx, frequency, note_length, loud, _old, _duration) {

      var oscillator = audioCtx.createOscillator();
      var gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
      gainNode.gain.value = setGain(loud);
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.start(_old);
      console.log('{ duration:' + (_old + (0.001+ _duration)) + ', volume: ' + loud + ', pitch:' + frequency + ', id: ' + _old +'}');
      _model.push('{ duration:' + (_old + (0.001+ _duration)) + ', volume: ' + loud + ', pitch:' + frequency + ', id: ' + _old +'}');
      oscillator.stop(_old + (0.001 + _duration));
      oscillator.connect(audioCtx.destination);
    };

    return {
        start:start
    }
  };

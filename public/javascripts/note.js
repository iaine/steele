  var Note = function() {

    function start(audioCtx, frequency, note_length, volume, id) {

      var oscillator = audioCtx.createOscillator();
      var gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
      gainNode.gain.value = volume;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.start(id);
      
      oscillator.stop(id + (0.001 + note_length));
      oscillator.connect(audioCtx.destination);
    };

    return {
        start:start
    }
  };

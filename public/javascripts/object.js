var mObj;

mObj = function () {
  this.object = Array();

  function add (note, time, freq, gain) {
    this.object.push({'note': note, 'time':time, 'freq':freq, 'gain': gain});
  }

  function update(update, slice, type) {
      this.object[slice][type] = update;
  }

  return {
    add:add,
    update:update
  }
}

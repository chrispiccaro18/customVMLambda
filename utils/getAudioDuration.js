const AudioBuffer = require('audio-buffer');

module.exports = audio => {
  const buffer = new AudioBuffer(audio);
  return buffer.duration;
}

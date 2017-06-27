'use strict';

var izFileExtension = require('./fileExtension');

module.exports = function izFileExtensionAudio(value) {
  var validExtensions = ['mp3', 'ogg', 'aac', 'wav'];
  return izFileExtension(value, validExtensions);
};
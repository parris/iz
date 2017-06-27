'use strict';

var izFileExtension = require('./fileExtension');

module.exports = function izFileExtensionVideo(value) {
  var validExtensions = ['mp4', 'ogv', 'm4v', 'mov', 'avi'];
  return izFileExtension(value, validExtensions);
};
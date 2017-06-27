'use strict';

var izFileExtension = require('./fileExtension');

module.exports = function izFileExtensionImage(value) {
  var validExtensions = ['gif', 'png', 'jpeg', 'jpg', 'svg', 'bmp'];
  return izFileExtension(value, validExtensions);
};
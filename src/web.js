/*global require, module, window */
(function() {
    'use strict';

    // serves as our bootstrap into other node apps
    // let's not clutter up the .bin folder
    // this also helps when using onejs to compile for client side
    var iz = require('./iz'),
        are = require('./are'),
        validators = require('./validators');

    iz.are = are;
    iz.validators = validators;

    module.exports = iz;
}());

/*global require, module, window */
(function() {
    'use strict';

    // helps when using onejs to compile for client side
    var iz = require('./iz'),
        are = require('./are'),
        validators = require('./validators');

    iz.are = are;
    iz.validators = validators;

    module.exports = iz;
}());

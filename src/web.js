/*global require, module */
var iz = require('./iz'),
    are = require('./are'),
    validators = require('./validators');

(function() {
    'use strict';

    iz.are = are;
    iz.validators = validators;

    // drop izBundle onto window if there is no require system
    if (!window.require) {
        window.izBundle = iz;
    }

    module.exports = iz;
}());

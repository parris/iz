/*global require, module */

(function() {
    'use strict';

    // serves as our bootstrap into other node apps
    var iz = require('../iz/src/iz'),
        are = require('../iz/src/are'),
        validators = require('../iz/src/validators');

    iz.are = are;
    iz.validators = validators;

    module.exports = iz;
}());

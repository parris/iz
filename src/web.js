/*global require, module */
var iz = require('./iz'),
    are = require('./are'),
    validators = require('./validators');

(function() {
    'use strict';

    iz.are = are;
    iz.validators = validators;

    module.exports = iz;
}());

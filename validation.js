var Validations = Validations || {};

(function () {
   'use strict';

    function validations_isInteger(value) {
        return (/^\s*(\+|-)?\d+\s*$/).test(value);
    }

    //This is just static, no need to make a new instance here
    Validations.isInteger = validations_isInteger;
}());

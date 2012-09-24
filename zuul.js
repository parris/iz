/*global module*/
var zuul = zuul || {};

(function () {
    'use strict';

    function zuul_alphaNumeric(value) {
        return (/^[a-z0-9]+$/i).test(value);
    }

    function zuul_number(val) {
        if ((/^[\-]?[0-9]+[\.]?[0-9]+$/).test(val)) {
            return true;
        }
        return false;
    }

    function zuul_between(val, start, end) {
        if ((typeof val === "object" || typeof val === "function") ||
                (typeof start === "object" || typeof start === "function") ||
                (typeof end === "object" || typeof end === "function")) {
            return false;
        }

        if ((val >= start && val <= end)) {
            return true;
        }
        return false;
    }

    function zuul_int(value) {
        return (/^\s*(\+|-)?\d+\s*$/).test(value);
    }

    //This is just static, no need to make a new instance here
    zuul.alphaNumeric = zuul_alphaNumeric;
    zuul.between = zuul_between;
    zuul.int = zuul_int;
}());

module.exports = zuul;

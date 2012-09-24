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

    function zuul_boolean(value) {
        if (typeof value === "boolean" || (typeof value === "number" && (value === 0 || value === 1))) {
            return true;
        }
        return false;
    }

    function zuul_int(value) {
        return (/^\s*(\+|-)?\d+\s*$/).test(value);
    }

    /**
     * @author Phil Green (ShirtlessKirk) https://gist.github.com/2134376
     */
    function luhnChk(luhn) {
        var len = luhn.length,
            mul = 0,
            prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]],
            sum = 0;

        while (len--) {
            sum += prodArr[mul][parseInt(luhn.charAt(len), 10)];
            mul ^= 1;
        }

        return sum % 10 === 0 && sum > 0;
    }

    function zuul_cc(value) {
        value = value.replace(/[ -]/g, ""); // normalizing
        if (zuul_int(value)) {
            return luhnChk(value);
        }
        return false;
    }

    //This is just static, no need to make a new instance here
    zuul.alphaNumeric = zuul_alphaNumeric;
    zuul.between = zuul_between;
    zuul.boolean = zuul_boolean;
    zuul.cc = zuul_cc;
    zuul.int = zuul_int;
}());

module.exports = zuul;

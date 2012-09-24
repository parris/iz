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

    /**
     * Returns the name of the class that the object is
     * @author Ateş Göral: http://blog.magnetiq.com/post/514962277/finding-out-class-names-of-javascript-objects
     * @param object
     * @return String name of the class
     */
    function zuul_getObjectClass(obj) {
        if (obj && obj.constructor && obj.constructor.toString) {
            var arr = obj.constructor.toString().match(/function\s*(\w+)/);

            if (arr && arr.length === 2) {
                return arr[1];
            }
        }

        return undefined;
    }

    function zuul_cc(value) {
        if (typeof value !== "string" && typeof value !== "number") {
            return false;
        }

        value = value.replace(/[ -]/g, ""); // normalizing
        if (zuul_int(value)) {
            return luhnChk(value);
        }
        return false;
    }

    /**
     * TODO: maybe provide format and use: http://www.mattkruse.com/javascript/date/source.html
     * but that seems in elegant. Then again dates in general are in elegant... *shrug*
     * @param value
     * @return {Boolean}
     */
    function zuul_date(value) {
        if (zuul_getObjectClass(value) === "Date") {
            return true;
        }

        if (new Date(value).toString() !== "Invalid Date" || !isNaN(new Date(value))) { //some IEs return NaN
            return true;
        }

        return false;
    }

    function zuul_decimal(value) {
        if (zuul_number(value) && value % 1 !== 0) {
            return true;
        }
        return false;
    }

    /**
     * Basically just expects the @ symbol. There was a full discussion about it here:
     * http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
     *
     * Might make this more complicated in the future... or not *shrug*
     * @param value
     * @return {Boolean}
     */
    function zuul_email(value) {
        if (typeof value !== "string") {
            return false;
        }
        return (/\S+@\S+/).test(value);
    }

    //This is just static, no need to make a new instance here
    zuul.alphaNumeric = zuul_alphaNumeric;
    zuul.between = zuul_between;
    zuul.boolean = zuul_boolean;
    zuul.cc = zuul_cc;
    zuul.date = zuul_date;
    zuul.decimal = zuul_decimal;
    zuul.email = zuul_email;
    zuul.int = zuul_int;
}());

module.exports = zuul;

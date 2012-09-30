/*global module, exports*/
var iz = iz || {};

(function () {
    'use strict';

    function iz_alphaNumeric(value) {
        return (/^[a-z0-9]+$/i).test(value);
    }

    function iz_number(val) {
        if ((typeof val === "string" || typeof val === "number")
                && !isNaN(val % 1)) {
            return true;
        }
        return false;
    }

    function iz_between(val, start, end) {
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

    function iz_boolean(value) {
        if (typeof value === "boolean" || (typeof value === "number" && (value === 0 || value === 1))) {
            return true;
        }
        return false;
    }

    function iz_int(value, allowDecimal) {
        if (typeof allowDecimal !== "boolean") {
            allowDecimal = false;
        }

        if (!allowDecimal) {
            return (/^\s*(\+|-)?\d+\s*$/).test(value);
        } else if (iz_number(value) && value % 1 === 0) {
            return true;
        }
        return false;
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
    function iz_getObjectClass(obj) {
        if (obj && obj.constructor && obj.constructor.toString) {
            var arr = obj.constructor.toString().match(/function\s*(\w+)/);

            if (arr && arr.length === 2) {
                return arr[1];
            }
        }

        return undefined;
    }

    function iz_cc(value) {
        if (typeof value !== "string" && typeof value !== "number") {
            return false;
        }

        value = value.replace(/[ -]/g, ""); // normalizing
        if (iz_int(value)) {
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
    function iz_date(value) {
        if (iz_getObjectClass(value) === "Date") {
            return true;
        }

        if (new Date(value).toString() !== "Invalid Date" || !isNaN(new Date(value))) { //some IEs return NaN
            return true;
        }

        return false;
    }

    function iz_decimal(value) {
        if (iz_number(value) && value % 1 !== 0) {
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
    function iz_email(value) {
        if (typeof value !== "string") {
            return false;
        }
        return (/\S+@\S+/).test(value);
    }

    function iz_extension(obj1, obj2) {
        var key;
        if (typeof obj1 !== "object" || typeof obj2 !== "object") {
            return false;
        }

        for (key in obj2) {
            if (obj2.hasOwnProperty(key) && typeof obj1[key] === "undefined") {
                return false;
            }
        }

        return true;
    }

    /**
     * Accepts anything.anything.anything.ext.ext and matches the last ext
     * @param value a file extension of a file name
     */
    function iz_fileExtension(validExtensions, value) {
        var ext;

        if (typeof validExtensions !== "object"
                || typeof validExtensions.indexOf === "undefined"
                || typeof value !== "string") {
            return false;
        }

        ext = value.split(".").pop().toLowerCase(); //split by '.' and get me the last thing, then lowercase it
        if (validExtensions.indexOf(ext) !== -1) {
            return true;
        }
        return false;
    }

    function iz_fileExtensionAudio(value) {
        var validExtensions = ["mp3", "ogg", "aac", "wav"];
        return iz_fileExtension(validExtensions, value);
    }

    function iz_fileExtensionImage(value) {
        var validExtensions = ["gif", "png", "jpeg", "jpg", "svg", "bmp"];
        return iz_fileExtension(validExtensions, value);
    }

    function iz_fileExtensionVideo(value) {
        var validExtensions = ["mp4", "ogv", "m4v", "mov", "avi"];
        return iz_fileExtension(validExtensions, value);
    }

    function iz_inArray(arr, value) {
        if (typeof arr !== "object"
                || typeof arr.indexOf === "undefined") {
            return false;
        }

        if (arr.indexOf(value) !== -1) {
            return true;
        }
        return false;
    }

    /**
     * Matches IPv4, IPv6 or hostname
     * @author Mikulas Dite http://stackoverflow.com/questions/9208814/validate-ipv4-ipv6-and-hostname
     * @param str
     * @return boolean
     */
    function iz_ip(str) {
        var re = (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/);
        return re.test(str);
    }

    function iz_minLength(val, len) {
        if ((typeof val === "string"
                || typeof val === "object")
                && typeof val.length !== "undefined"
                && iz_int(len)
                && val.length >= len) {
            return true;
        }

        return false;
    }

    function iz_maxLength(val, len) {
        if ((typeof val === "string"
                || typeof val === "object")
                && typeof val.length !== "undefined"
                && iz_int(len)
                && val.length <= len) {
            return true;
        }

        return false;
    }

    function iz_multiple(num, multiple) {
        if (typeof num !== "number" || typeof multiple !== "number") {
            return false;
        }
        if (num % multiple === 0) {
            return true;
        }

        return false;
    }

    function iz_ofType(obj, type) {
        if (typeof obj === "object" && typeof obj.length === "undefined"
                && typeof type === "string") {
            //is truly an object
            if (iz_getObjectClass(obj) === type) {
                return true;
            }
        }
        return false;
    }

    function iz_phone(str) {
        var cleanedStr = "",
            numbers = [];
        if (typeof str === "string") {
            cleanedStr = str.replace(/[^x0-9]/g, '');
            numbers = cleanedStr.split("x");
            //first and last array elements are numbers, this allows for multiple x's between the phone number and extension (if exists)
            if (numbers.length > 0 && iz_int(numbers[0]) // has at least 1 value in the array and it is an integer
                    && (numbers[0].length === 10 || numbers[0].length === 11) // it has an extension with or without country code
                    && iz_int(numbers.pop())) { //if it is has an extension it is a valid number
                return true;
            }
        }
        return false;
    }

    function iz_postal(str) {
        var cleanedStr = "";
        if (typeof str === "string") {
            //removing everything but numbers
            cleanedStr = str.replace(/[^0-9]/g, '');
            //is either a 5 or 9 digit zip code...
            if (iz_int(cleanedStr)
                    && (cleanedStr.length === 5 || cleanedStr.length === 9)) {
                return true;
            }
        }
        return false;
    }

    function iz_ssn(str) {
        var cleanedStr = "";
        if (typeof str === "string") {
            cleanedStr = str.replace(/[^0-9]/g, '');
            //There are varying rules depending on date of issuance. I will say that having 9 digits is all that is needed for now.
            if (iz_int(cleanedStr) && (cleanedStr.length === 9)) {
                return true;
            }
        }
        return false;
    }

    //Expose some methods
    iz.alphaNumeric = iz_alphaNumeric;
    iz.between = iz_between;
    iz.boolean = iz_boolean;
    iz.cc = iz_cc;
    iz.date = iz_date;
    iz.decimal = iz_decimal;
    iz.email = iz_email;
    iz.extension = iz_extension;
    iz.fileExtension = iz_fileExtension;
    iz.fileExtensionAudio = iz_fileExtensionAudio;
    iz.fileExtensionImage = iz_fileExtensionImage;
    iz.fileExtensionVideo = iz_fileExtensionVideo;
    iz.inArray = iz_inArray;
    iz.int = iz_int;
    iz.ip = iz_ip;
    iz.minLength = iz_minLength;
    iz.maxLength = iz_maxLength;
    iz.multiple = iz_multiple;
    iz.number = iz_number;
    iz.ofType = iz_ofType;
    iz.phone = iz_phone;
    iz.postal = iz_postal;
    iz.ssn = iz_ssn;

}());

/* allow for both module loading and standard js loading */
if (typeof exports !== "undefined") {
    exports.iz = iz;
}
if (typeof module !== "undefined") {
    module.exports = iz;
}

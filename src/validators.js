(function() {
    var validators = {};

    function iz_alphaNumeric(value) {
        return (/^[a-z0-9]+$/i).test(value);
    }

    function iz_number(val) {
        if ((typeof val === "string" || typeof val === "number") && !isNaN(val % 1)) {
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
     * @author http://blog.magnetiq.com/post/514962277/finding-out-class-names-of-javascript-objects
     * @param obj{Object}
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

        value = value.replace(/[ \-]/g, ""); // normalizing
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
        return iz_getObjectClass(value) === "Date" ||
            new Date(value).toString() !== "Invalid Date" || !isNaN(new Date(value));
    }

    function iz_decimal(value) {
        return iz_number(value) && Math.floor(value) != value;
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
        return !(typeof value !== "string") && (/\S+@\S+/).test(value);
    }

    /**
     * True if the parameter is empty. length > 0 for objects (if exists) or arrays, Functions/Objects have no properties,
     * or the type is primitive.
     * @param value of any type
     * @return {Boolean}
     */
    function iz_empty(value) {
        var type = typeof value,
            key;
        //arrays and objects with length properties
        if(value.hasOwnProperty("length") && type !== "function" && value.length > 0) {
            return false;
        } else if(type === "function" || type === "object") {
            for (key in value) {
                if(value.hasOwnProperty(key)) {
                    return false; //on first valid key, return false;
                }
            }
        }

        //primitives are empty as are objects without properties and empty arrays
        return true;
    }

    function iz_blank(value) {
        if (typeof value === "string") {
            return iz_empty(value);
        }

        return false;
    }

    /**
     * Strictly Equal
     * @param value
     * @param value2
     * @return {Boolean}
     */
    function iz_equal(value, value2) {
        var valueType = typeof value,
            value2Type = typeof value2,
            key;

        if ((valueType === "object" || valueType === "function") && typeof value.equals === "function") {
            if ((value2Type === "object" || value2Type === "function")) {
                //value2 does not need the equals method, if an exception is thrown here that is the implementor
                //catching it returning false might result in a bug that is hard to track
                return value.equals(value2);
            }
        } else if(valueType === "object" || valueType === "function") {
            for(key in value) {
                if (value.hasOwnProperty(key) && !value2.hasOwnProperty(key) && key !== "equals") {
                    //if property is an object then recursively check
                    if (typeof value[key] === "object" || typeof value[key] === "function" && !iz_equal(value[key], value2[key])) {
                        return false;
                    } else if (value[key] !== value2[key]) { //if not object or function
                        return false;
                    }
                }
            }
            return true;
        }

        return value === value2;
    }

    /**
     * Is obj1 and extension of obj2? True if this is the case.
     * @param obj1
     * @param obj2
     * @return {Boolean}
     */
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
    function iz_fileExtension(value, validExtensions) {
        var ext;

        if (typeof validExtensions !== "object" ||
                typeof validExtensions.indexOf === "undefined" || typeof value !== "string") {
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
        return iz_fileExtension(value, validExtensions);
    }

    function iz_fileExtensionImage(value) {
        var validExtensions = ["gif", "png", "jpeg", "jpg", "svg", "bmp"];
        return iz_fileExtension(value, validExtensions);
    }

    function iz_fileExtensionVideo(value) {
        var validExtensions = ["mp4", "ogv", "m4v", "mov", "avi"];
        return iz_fileExtension(value, validExtensions);
    }

    function iz_inArray(value, arr) {
        if (typeof arr !== "object" || typeof arr.indexOf === "undefined") {
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
        if ((typeof val === "string" || typeof val === "object") &&
                typeof val.length !== "undefined" && iz_int(len) && val.length >= len) {
            return true;
        }

        return false;
    }

    function iz_maxLength(val, len) {
        if ((typeof val === "string" || typeof val === "object") &&
            typeof val.length !== "undefined" && iz_int(len) && val.length <= len) {
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
        if (typeof obj === "object" && typeof obj.length === "undefined" && typeof type === "string") {
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
            if (numbers.length > 0 && iz_int(numbers[0]) &&  // has at least 1 value in the array and it is an integer
                    (numbers[0].length === 10 || numbers[0].length === 11) && // it has an extension with or without country code
                    iz_int(numbers.pop())) { //if it is has an extension it is a valid number
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
            if (iz_int(cleanedStr) &&
                    (cleanedStr.length === 5 || cleanedStr.length === 9)) {
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

    function iz_present(obj) {
        return obj !== undefined && obj !== null;
    }

    //Expose some methods, this is done to preserve function names in all browsers
    validators.alphaNumeric = iz_alphaNumeric;
    validators.between = iz_between;
    validators.blank = iz_blank;
    validators.boolean = iz_boolean;
    validators.cc = iz_cc;
    validators.date = iz_date;
    validators.decimal = iz_decimal;
    validators.email = iz_email;
    validators.empty = iz_empty;
    validators.equal = iz_equal;
    validators.extension = iz_extension;
    validators.fileExtension = iz_fileExtension;
    validators.fileExtensionAudio = iz_fileExtensionAudio;
    validators.fileExtensionImage = iz_fileExtensionImage;
    validators.fileExtensionVideo = iz_fileExtensionVideo;
    validators.inArray = iz_inArray;
    validators.int = iz_int;
    validators.ip = iz_ip;
    validators.minLength = iz_minLength;
    validators.maxLength = iz_maxLength;
    validators.multiple = iz_multiple;
    validators.number = iz_number;
    validators.ofType = iz_ofType;
    validators.phone = iz_phone;
    validators.postal = iz_postal;
    validators.ssn = iz_ssn;
    validators.present = iz_present;


    // Export module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = validators;
        }
        exports.validators = validators;
    }
}());

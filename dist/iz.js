/*!
 * iz - v0.2.0 https://github.com/parris/iz
 * Built: 2013-06-09
 * Copyright (c) 2013 Parris Khachi;
 * Licensed under the MIT license
 */
(function(process) {
    require.m = {
        0: [ function(require, module, exports) {
            var iz = require("./iz"), are = require("./are"), validators = require("./validators");
            (function() {
                "use strict";
                iz.are = are;
                iz.validators = validators;
                module.exports = iz;
            })();
        }, {
            "./iz": 1,
            "./are": 3,
            "./validators": 2
        } ],
        1: [ function(require, module, exports) {
            var validators = require("./validators");
            (function() {
                "use strict";
                var iz;
                function Iz(value, error_messages) {
                    var self = this;
                    if (typeof error_messages === "object") {
                        this.error_messages = error_messages;
                    } else {
                        this.error_messages = {};
                    }
                    this._not = false;
                    this._calledValidations = {};
                    function not() {
                        self._not = true;
                        return self;
                    }
                    function revalidate() {
                        self.errors = [];
                        self.valid = true;
                        for (var key in self._calledValidations) {
                            var rule = self._calledValidations[key];
                            if (self._calledValidations.hasOwnProperty(key)) {
                                if (rule.not) {
                                    self.not();
                                }
                                validator_partial(rule.validation).apply(self, rule.args);
                            }
                        }
                        return self;
                    }
                    function setValue(value) {
                        self.value = value;
                        self.revalidate();
                        return self;
                    }
                    this.not = not;
                    this.value = value;
                    this.setValue = setValue;
                    this.revalidate = revalidate;
                    this.errors = [];
                    this.valid = true;
                    function validator_partial(fn) {
                        var fnName = Array.prototype.slice.call(arguments)[0], args = Array.prototype.slice.call(arguments, 1);
                        args.unshift(value);
                        return function() {
                            var argArray = Array.prototype.slice.call(arguments), allArguments = [ self.value ].concat(argArray), result = validators[fn].apply(null, allArguments), key = (self._not ? "not_" : "") + fnName;
                            self._calledValidations[key] = {
                                not: self._not,
                                validation: fn,
                                args: argArray
                            };
                            if (!this._not && !result || this._not && result) {
                                if (!this._not && typeof this.error_messages[fn] !== "undefined") {
                                    this.errors.push(this.error_messages[fn]);
                                } else if (this._not && typeof this.error_messages["not_" + fn] !== "undefined") {
                                    this.errors.push(this.error_messages["not_" + fn]);
                                } else if (this._not) {
                                    this.errors.push("Not " + fn);
                                } else {
                                    this.errors.push(fn);
                                }
                                this.valid = false;
                            }
                            this._not = false;
                            return this;
                        };
                    }
                    for (var fn in validators) {
                        if (validators.hasOwnProperty(fn)) {
                            this[fn] = validator_partial(fn);
                        }
                    }
                }
                iz = function(value, error_messages) {
                    return new Iz(value, error_messages);
                };
                for (var fn in validators) {
                    if (validators.hasOwnProperty(fn)) {
                        iz[fn] = validators[fn];
                    }
                }
                if (typeof exports !== "undefined") {
                    if (typeof module !== "undefined" && module.exports) {
                        exports = module.exports = iz;
                    }
                    exports.iz = iz;
                }
            })();
        }, {
            "./validators": 2
        } ],
        3: [ function(require, module, exports) {
            (function() {
                "use strict";
                var are;
                function Are(rules) {
                    var self = this;
                    self._rules = rules;
                    this.valid = function() {
                        for (var key in self._rules) {
                            self._rules[key].revalidate();
                            if (!self._rules[key].valid) {
                                return false;
                            }
                        }
                        return true;
                    };
                }
                are = function(rules) {
                    return new Are(rules);
                };
                if (typeof exports !== "undefined") {
                    if (typeof module !== "undefined" && module.exports) {
                        exports = module.exports = are;
                    }
                    exports.are = are;
                }
            })();
        }, {} ],
        2: [ function(require, module, exports) {
            (function() {
                var validators = {};
                function iz_alphaNumeric(value) {
                    return /^[a-z0-9]+$/i.test(value);
                }
                function iz_number(val) {
                    if ((typeof val === "string" || typeof val === "number") && !isNaN(val % 1)) {
                        return true;
                    }
                    return false;
                }
                function iz_between(val, start, end) {
                    if (typeof val === "object" || typeof val === "function" || typeof start === "object" || typeof start === "function" || typeof end === "object" || typeof end === "function") {
                        return false;
                    }
                    if (val >= start && val <= end) {
                        return true;
                    }
                    return false;
                }
                function iz_boolean(value) {
                    if (typeof value === "boolean" || typeof value === "number" && (value === 0 || value === 1)) {
                        return true;
                    }
                    return false;
                }
                function iz_int(value, allowDecimal) {
                    if (typeof allowDecimal !== "boolean") {
                        allowDecimal = false;
                    }
                    if (!allowDecimal) {
                        return /^\s*(\+|-)?\d+\s*$/.test(value);
                    } else if (iz_number(value) && value % 1 === 0) {
                        return true;
                    }
                    return false;
                }
                function luhnChk(luhn) {
                    var len = luhn.length, mul = 0, prodArr = [ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ], [ 0, 2, 4, 6, 8, 1, 3, 5, 7, 9 ] ], sum = 0;
                    while (len--) {
                        sum += prodArr[mul][parseInt(luhn.charAt(len), 10)];
                        mul ^= 1;
                    }
                    return sum % 10 === 0 && sum > 0;
                }
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
                    value = value.replace(/[ \-]/g, "");
                    if (iz_int(value)) {
                        return luhnChk(value);
                    }
                    return false;
                }
                function iz_date(value) {
                    return iz_getObjectClass(value) === "Date" || new Date(value).toString() !== "Invalid Date" || !isNaN(new Date(value));
                }
                function iz_decimal(value) {
                    return iz_number(value) && Math.floor(value) != value;
                }
                function iz_email(value) {
                    return !(typeof value !== "string") && /\S+@\S+/.test(value);
                }
                function iz_empty(value) {
                    var type = typeof value, key;
                    if (value.hasOwnProperty("length") && type !== "function" && value.length > 0) {
                        return false;
                    } else if (type === "function" || type === "object") {
                        for (key in value) {
                            if (value.hasOwnProperty(key)) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                function iz_blank(value) {
                    if (typeof value === "string") {
                        return iz_empty(value);
                    }
                    return false;
                }
                function iz_equal(value, value2) {
                    var valueType = typeof value, value2Type = typeof value2, key;
                    if ((valueType === "object" || valueType === "function") && typeof value.equals === "function") {
                        if (value2Type === "object" || value2Type === "function") {
                            return value.equals(value2);
                        }
                    } else if (valueType === "object" || valueType === "function") {
                        for (key in value) {
                            if (value.hasOwnProperty(key) && !value2.hasOwnProperty(key) && key !== "equals") {
                                if (typeof value[key] === "object" || typeof value[key] === "function" && !iz_equal(value[key], value2[key])) {
                                    return false;
                                } else if (value[key] !== value2[key]) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    return value === value2;
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
                function iz_fileExtension(value, validExtensions) {
                    var ext;
                    if (typeof validExtensions !== "object" || typeof validExtensions.indexOf === "undefined" || typeof value !== "string") {
                        return false;
                    }
                    ext = value.split(".").pop().toLowerCase();
                    if (validExtensions.indexOf(ext) !== -1) {
                        return true;
                    }
                    return false;
                }
                function iz_fileExtensionAudio(value) {
                    var validExtensions = [ "mp3", "ogg", "aac", "wav" ];
                    return iz_fileExtension(value, validExtensions);
                }
                function iz_fileExtensionImage(value) {
                    var validExtensions = [ "gif", "png", "jpeg", "jpg", "svg", "bmp" ];
                    return iz_fileExtension(value, validExtensions);
                }
                function iz_fileExtensionVideo(value) {
                    var validExtensions = [ "mp4", "ogv", "m4v", "mov", "avi" ];
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
                function iz_ip(str) {
                    var re = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/;
                    return re.test(str);
                }
                function iz_minLength(val, len) {
                    if ((typeof val === "string" || typeof val === "object") && typeof val.length !== "undefined" && iz_int(len) && val.length >= len) {
                        return true;
                    }
                    return false;
                }
                function iz_maxLength(val, len) {
                    if ((typeof val === "string" || typeof val === "object") && typeof val.length !== "undefined" && iz_int(len) && val.length <= len) {
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
                        if (iz_getObjectClass(obj) === type) {
                            return true;
                        }
                    }
                    return false;
                }
                function iz_phone(str) {
                    var cleanedStr = "", numbers = [];
                    if (typeof str === "string") {
                        cleanedStr = str.replace(/[^x0-9]/g, "");
                        numbers = cleanedStr.split("x");
                        if (numbers.length > 0 && iz_int(numbers[0]) && (numbers[0].length === 10 || numbers[0].length === 11) && iz_int(numbers.pop())) {
                            return true;
                        }
                    }
                    return false;
                }
                function iz_postal(str) {
                    var cleanedStr = "";
                    if (typeof str === "string") {
                        cleanedStr = str.replace(/[^0-9]/g, "");
                        if (iz_int(cleanedStr) && (cleanedStr.length === 5 || cleanedStr.length === 9)) {
                            return true;
                        }
                    }
                    return false;
                }
                function iz_ssn(str) {
                    var cleanedStr = "";
                    if (typeof str === "string") {
                        cleanedStr = str.replace(/[^0-9]/g, "");
                        if (iz_int(cleanedStr) && cleanedStr.length === 9) {
                            return true;
                        }
                    }
                    return false;
                }
                function iz_required(obj) {
                    return obj !== undefined && obj !== null && obj !== "";
                }
                function iz_required_or(validator) {
                    return function(val) {
                        return !iz_required(val) || validator.apply(this, Array.prototype.slice.call(arguments));
                    };
                }
                validators.alphaNumeric = iz_required_or(iz_alphaNumeric);
                validators.between = iz_required_or(iz_between);
                validators.blank = iz_required_or(iz_blank);
                validators.boolean = iz_required_or(iz_boolean);
                validators.cc = iz_required_or(iz_cc);
                validators.date = iz_required_or(iz_date);
                validators.decimal = iz_required_or(iz_decimal);
                validators.email = iz_required_or(iz_email);
                validators.empty = iz_required_or(iz_empty);
                validators.equal = iz_required_or(iz_equal);
                validators.extension = iz_extension;
                validators.fileExtension = iz_required_or(iz_fileExtension);
                validators.fileExtensionAudio = iz_required_or(iz_fileExtensionAudio);
                validators.fileExtensionImage = iz_required_or(iz_fileExtensionImage);
                validators.fileExtensionVideo = iz_required_or(iz_fileExtensionVideo);
                validators.inArray = iz_inArray;
                validators.int = iz_required_or(iz_int);
                validators.ip = iz_required_or(iz_ip);
                validators.minLength = iz_required_or(iz_minLength);
                validators.maxLength = iz_required_or(iz_maxLength);
                validators.multiple = iz_required_or(iz_multiple);
                validators.number = iz_required_or(iz_number);
                validators.ofType = iz_required_or(iz_ofType);
                validators.phone = iz_required_or(iz_phone);
                validators.postal = iz_required_or(iz_postal);
                validators.required = iz_required;
                validators.ssn = iz_required_or(iz_ssn);
                if (typeof exports !== "undefined") {
                    if (typeof module !== "undefined" && module.exports) {
                        exports = module.exports = validators;
                    }
                    exports.validators = validators;
                }
            })();
        }, {} ]
    };
    function require(o) {
        if (o[2]) return o[2].exports;
        o[0](function(u) {
            if (!require.m[o[1][u]]) {
                throw new Error('Cannot find module "' + u + '"');
            }
            return require(require.m[o[1][u]]);
        }, o[2] = {
            exports: {}
        }, o[2].exports);
        return o[2].exports;
    }
    return require(require.m[0]);
})({
    env: {}
});
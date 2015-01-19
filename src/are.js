/*global module, exports */

var iz = require('./iz');

(function () {
    'use strict';
    var are;

    function Are(rules) {
        var self = this,
            currentRule,
            rule,
            errors,
            key;

        self.fields = {};

        for (key in rules) {
            if (!rules.hasOwnProperty(key)) {
                continue;
            }

            // if is an iz object just add rule directly, if not assemble an iz object
            if (typeof rules[key].revalidate !== 'undefined') {
                self.fields[key] = rules[key];
            } else {
                errors = {};

                // make errors dictionary
                for (rule in rules[key]) {
                    if (!rules[key].hasOwnProperty(rule)) {
                        continue;
                    }

                    if (rules[key][rule].error) {
                        errors[rules[key][rule].rule] = rules[key][rule].error;
                    }
                }

                currentRule = iz(0, errors);

                // call rule
                for (rule in rules[key]) {
                    if (!rules[key].hasOwnProperty(rule)) {
                        continue;
                    }

                    // handle 'not_'
                    if (rules[key][rule].rule.indexOf('not_') > -1) {
                        currentRule.not();
                    }

                    currentRule[rules[key][rule].rule.replace('not_', '')].apply(
                        currentRule,
                        rules[key][rule].args || []
                    );
                }

                self.fields[key] = currentRule;
            }
        }

        this.valid = function() {
            for (var key in self.fields) {
                if (!self.fields[key].hasOwnProperty(key)) {
                    continue;
                }

                self.fields[key].revalidate();
                if (!self.fields[key].valid) {
                    return false;
                }
            }

            return true;
        };

        this.validFor = function(values) {
            var field,
                i = 0,
                fieldKeys,
                currentValue,
                areAllRulesValid = true;

            for (field in self.fields) {
                if (!self.fields.hasOwnProperty(field)) {
                    continue;
                }

                fieldKeys = field.split('.');
                currentValue = values[fieldKeys[0]];

                // account for chained field names
                for (i = 1; i < fieldKeys.length; i++) {
                    // we'll get an out of bounds error if the field doesn't exist
                    // let's treat this as an undefined
                    try {
                        currentValue = currentValue[fieldKeys[i]];
                    } catch (e) {
                        currentValue = undefined;
                    }
                }

                self.fields[field].setValue(currentValue);

                if (!self.fields[field].valid) {
                    areAllRulesValid = false;
                }
            }

            if (!areAllRulesValid) {
                return false;
            }

            return true;
        };

        this.getInvalidFields = function() {
            var errorFields = {},
                key;

            for (key in self.fields) {
                if(self.fields[key].errors && self.fields[key].errors.length) {
                    errorFields[key] = self.fields[key].errors;
                }
            }

            return errorFields;
        };
    }

    are = function(rules) {
        return new Are(rules);
    };

    // Export module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = are;
        }
        exports.are = are;
    }
}());

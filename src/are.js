/*global module, exports */

var iz = require('./iz');

(function () {
    'use strict';
    var are;

    function Are(rules, fullValidator) {
        var self = this,
            currentRule,
            rule,
            errors,
            key;

        self._fields = {};
        
        self._errors = {};

        for (key in rules) {
            if (!rules.hasOwnProperty(key)) {
                continue;
            }

            // if is an iz object just add rule directly, if not assemble an iz object
            if (typeof rules[key].revalidate !== 'undefined') {
                self._fields[key] = rules[key];
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

                self._fields[key] = currentRule;
            }
        }

        this.valid = function() {
            var valid = true;
            for (var key in self._fields) {
                if (!self._fields[key].hasOwnProperty(key)) {
                    continue;
                }

                self._fields[key].revalidate();
                if (!self._fields[key].valid) {
                   if (!fullValidator) {
                       return false;
                   }
                   valid = false;
                   self._errors[key] = self._fields[key].errors;
                }
            }

            return valid;
        };

        this.validFor = function(values) {
            var field,
                i = 0,
                valid = true,
                fieldKeys,
                currentValue;

            for (field in self._fields) {
                if (!self._fields.hasOwnProperty(field)) {
                    continue;
                }

                fieldKeys = field.split('.');
                currentValue = values[fieldKeys[0]];

                // account for chained field names
                for (i = 1; i < fieldKeys.length; i++) {
                    currentValue = currentValue[fieldKeys[i]];
                }

                self._fields[field].setValue(currentValue);

                if (!self._fields[field].valid) {
                   if (!fullValidator) {
                       return false;
                   }
                   valid = false;
                   self._errors[key] = self._fields[key].errors;
                }
            }

            return valid;
        };
    }

    are = function(rules, fullValidator) {
        return new Are(rules, fullValidator);
    };

    // Export module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = are;
        }
        exports.are = are;
    }
}());

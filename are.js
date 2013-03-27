/*global module, exports, window*/

(function () {
    'use strict';
    var are;

    function Are(rules) {
        var self = this;
        self._rules = rules;

        this.valid = function() {
            for(var key in self._rules) {
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

    /**
    *  Allow for both module loading and standard js loading
    *  Credit to Underscore.js source code for this method.
    **/
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = are;
        }
        exports.are = are;
    } else {
        window.are = are;
    }
}());

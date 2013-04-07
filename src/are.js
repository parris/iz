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

    // Export module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = are;
        }
        exports.are = are;
    }
}());

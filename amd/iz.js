define(function (require, exports, module) {/*global module, exports, require */
var validators = require('./validators');

(function () {
    

    var iz;

    /**
     * @param value
     * @param error_messages
     * @constructor
     */
    function Iz(value, error_messages) {
        var self = this;

        if (typeof error_messages === 'object') {
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

                    validator_partial(rule.validation)
                        .apply(self, rule.args);
                }
            }
            return self;
        }

        function setValue(value) {
            self.value = value;
            self.revalidate();
            return self;
        }

        /**
         * Formats a string using the args index as the key
         * @param {String} string
         * @param {Array|Object} args
         */
        function format(string, args) {
            for (var i in args) {
                string = string.replace(
                    new RegExp('\{\{\\s*'+i+'\\s*\}\}', 'gim'),
                    args[i]
                );
            }
            return string;
        }

        this.not = not;
        this.value = value;
        this.setValue = setValue;
        this.revalidate = revalidate;
        this.errors = [];
        this.valid = true;

        /**
         * Partial application with currying into a validation function. Pushes to error array if an error exists.
         * If an error_message is specified for some specific check then that message is used. Otherwise just the function name.
         * Also sets valid to false if an error is found. It can't ever set valid to true.
         * @param fn
         */
        function validator_partial(fn) {
            var fnName = Array.prototype.slice.call(arguments)[0],
                args = Array.prototype.slice.call(arguments, 1);
            args.unshift(value); //add value to the front
            return function() {
                var argArray = Array.prototype.slice.call(arguments),
                    allArguments = [self.value].concat(argArray),
                    result = validators[fn].apply(null, allArguments),
                    key = (self._not ? 'not_' : '') + fnName;

                //save rules that have been called
                self._calledValidations[key] = {
                    not: self._not,
                    validation: fn,
                    args: argArray
                };

                //2 failed validation cases
                if ((!this._not && !result) || (this._not && result)) {
                    //change error message based on not and if an error message is specified
                    if (!this._not && typeof this.error_messages[fn] !== 'undefined') {
                        this.errors.push(format(this.error_messages[fn], allArguments));
                    } else if (this._not && typeof this.error_messages['not_' + fn] !== 'undefined') {
                        this.errors.push(format(this.error_messages['not_' + fn], allArguments));
                    } else if (this._not) {
                        this.errors.push('Not ' + fn);
                    } else {
                        this.errors.push(fn);
                    }
                    //all of these cases result in non-validity
                    this.valid = false;
                }
                //set not back for the next test
                this._not = false;
                //chain
                return this;
            };
        }

        for (var fn in validators) {
            if (validators.hasOwnProperty(fn)) {
                this[fn] = validator_partial(fn);
            }
        }
    }

    /**
     * Factory for creating chained checking objects
     * @param value{*}
     * @param error_messages{Object}
     * @return {Object} of type Iz
     */
    iz = function (value, error_messages) {
        return (new Iz(value, error_messages));
    };

    for (var fn in validators) {
        if (validators.hasOwnProperty(fn)) {
            iz[fn] = validators[fn];
        }
    }

    iz.addValidator = function (name, func, force) {
        validators.addValidator(name, func, force);
        iz[name] = func;
    };

    // Export module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = iz;
        }
        exports.iz = iz;
    }
}());

});

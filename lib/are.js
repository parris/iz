'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var iz = require('./iz');

function getValue(values, nesting) {
  var parts = nesting.split('.');
  var currentValue = undefined;
  var currentPart = void 0;

  while (parts.length) {
    try {
      currentPart = currentPart.nesting.shift();
      currentValue = values[currentPart];
    } catch (_) {
      break;
    }
  }

  return currentValue;
}

function getErrors(rules, key) {
  var errors = {};

  rules[key].forEach(function (ruleDefinition) {
    if (ruleDefinition.error) {
      errors[ruleDefinition.rule] = ruleDefinition.error;
    }
  });

  return errors;
}

var Result = function () {
  function Result(allIzs, allPromises) {
    _classCallCheck(this, Result);

    this.allIzs = allIzs;
    this.allPromises = allPromises;
  }

  _createClass(Result, [{
    key: 'validateAll',
    value: function validateAll() {
      return this.allIzs.reduce(function (memo, currentIz) {
        return !currentIz.iz.valid ? false : memo;
      }, true);
    }
  }, {
    key: 'getInvalidFields',
    value: function getInvalidFields() {
      return this.allIzs.reduce(function (acc, currentIz) {
        if (!currentIz.iz.valid) {
          acc[currentIz.ruleName] = currentIz.iz.errors;
        }
        return acc;
      }, {});
    }
  }, {
    key: 'async',
    get: function get() {
      var result = this;
      return Promise.all(this.allPromises).then(function () {
        return result;
      }).catch(function () {
        return result;
      });
    }
  }, {
    key: 'invalidFields',
    get: function get() {
      return this.getInvalidFields();
    }
  }, {
    key: 'valid',
    get: function get() {
      return this.validateAll();
    }
  }]);

  return Result;
}();

module.exports = function (rules) {
  return {
    for: function _for(values) {
      var allIzs = [];
      var allPromises = [];

      Object.keys(rules).forEach(function (key) {
        var currentIz = iz(getValue(values, key), getErrors(rules, key));

        Object.keys(rules[key]).forEach(function (index) {
          var _currentIz;

          var rule = rules[key][index];
          var args = rule.args && rule.args.length ? rule.args : [];
          currentIz = (_currentIz = currentIz)[rule.rule].apply(_currentIz, _toConsumableArray(args));
        });

        allPromises = allPromises.concat(currentIz.promises);
        allIzs.push({
          iz: currentIz,
          ruleName: key
        });
      });

      return new Result(allIzs, allPromises);
    }
  };
};
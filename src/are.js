var iz = require('./iz');

function getValue(values, nesting) {
  const parts = nesting.split('.');
  let currentValue = undefined;
  let currentPart;

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
  const errors = {};

  rules[key].forEach((ruleDefinition) => {
    if (ruleDefinition.error) {
      errors[ruleDefinition.rule] = ruleDefinition.error;
    }
  });

  return errors;
}

module.exports = function(rules) {
  return {
    valid: function() {
      let isValid = true;

      Object.keys(rules).forEach((name) => {
        if (!rules[name].valid) {
          isValid = false;
        }
      });

      return isValid;
    },
    for: function(values) {
      let isValid = true;
      const invalidFields = {};

      Object.keys(rules).forEach((key) => {
        let currentIz = iz(getValue(values, key), getErrors(rules, key));

        Object.keys(rules[key]).forEach((index) => {
          const rule = rules[key][index];
          const args = (rule.args && rule.args.length) ? rule.args : [];
          currentIz = currentIz[rule.rule](...args);
        });

        if (!currentIz.valid) {
          isValid = false;
          invalidFields[key] = currentIz.errors;
        }
      });

      return {
        get invalidFields() {
          return invalidFields;
        },
        get valid() {
          return isValid;
        },
        getInvalidFields() {
          return invalidFields;
        },
      };
    },
  };
};

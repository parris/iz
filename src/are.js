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

class Result {
  constructor(allIzs, allPromises) {
    this.allIzs = allIzs;
    this.allPromises = allPromises;
  }

  validateAll() {
    return this.allIzs.reduce(
      (memo, currentIz) => (!currentIz.iz.valid) ? false : memo,
      true
    );
  }

  getInvalidFields() {
    return this.allIzs.reduce((acc, currentIz) => {
      if (!currentIz.iz.valid) {
        acc[currentIz.ruleName] =  Object.assign(
          { errorCount: Object.keys(currentIz.iz.errorMessages).length },
          currentIz.iz.errorMessages
        );
      }
      return acc;
    }, {});
  }

  get async() {
    const result = this;
    return Promise.all(this.allPromises).then(() => result).catch(() => result);
  }

  get invalidFields() {
    return this.getInvalidFields();
  }

  get valid() {
    return this.validateAll();
  }

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
      const allIzs = [];
      let allPromises = [];

      Object.keys(rules).forEach((key) => {
        let currentIz = iz(getValue(values, key), getErrors(rules, key));

        Object.keys(rules[key]).forEach((index) => {
          const rule = rules[key][index];
          const args = (rule.args && rule.args.length) ? rule.args : [];
          currentIz = currentIz[rule.rule](...args);
        });

        allPromises = allPromises.concat(currentIz.promises);
        allIzs.push({
          iz: currentIz,
          ruleName: key,
        });
      });

      return new Result(allIzs, allPromises);
    },
  };
};

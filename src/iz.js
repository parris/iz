const validators = {};

function format(string, args) {
  for (var i in args) {
    string = string.replace(
      new RegExp('\{\{\\s*'+i+'\\s*\}\}', 'gim'),
      args[i]
    );
  }
  return string;
}

function captureError(target, name, isNotted, result, allArgs) {
  if ((!isNotted && !result) || (isNotted && result)) {
    if (target.errorMessages && typeof target.errorMessages[name] !== 'undefined') {
      target.errors.push(format(target.errorMessages[name], allArgs));
    } else {
      target.errors.push(name);
    }
    target.valid = false;
  }
}

function getValid(target) {
  if (!target.required && [undefined, null, ''].indexOf(target.valid) > -1) {
    return true;
  }
  return target.valid;
}

const proxyHandler = {
  get: function(target, name) {
    if (name === 'isIz') { return true; }
    if (name === 'valid') { return getValid(target); }
    if (name === 'async') {
      return Promise.all(target.promises).then(() => target).catch(() => target);
    }
    if (['errors', 'errorMessages', 'promises', 'value'].indexOf(name) > -1) { return target[name]; }
    if (name === 'required') {
      return function() {
        target.required = true;
        return new Proxy(target, proxyHandler);
      };
    }

    let validator = validators[name];
    let isNotted = false;
    if (name.indexOf('not') === 0) {
      isNotted = true;
      validator = validators[name.substr(3, 1).toLowerCase() + name.substr(4)];
    }

    if (typeof validator !== 'function') {
      throw new Error('Validator does not exist, have you registered it yet?');
    }

    return function(...args) {
      const allArgs = [target.value, ...args];
      const result = validator.apply(null, allArgs);
      target.promises.push(result);

      if (result instanceof Promise) {
        result
          .then((res) => captureError(target, name, isNotted, res, allArgs))
          .catch((res) => captureError(target, name, isNotted, res, allArgs));
      } else {
        captureError(target, name, isNotted, result, allArgs);
      }

      // allows for chaining
      return new Proxy(target, proxyHandler);
    };
  },
};

/**
 * Factory for creating chained checking objects
 * @param value{*}
 * @param errorMessages{Object}
 * @return {Object} of type Iz
 */
function iz(value, errorMessages) {
  return new Proxy({
    errors: [],
    errorMessages: errorMessages || {},
    promises: [],
    required: false,
    valid: true,
    value,
  }, proxyHandler);
}

function registerValidator(name, func, force) {
  if (
    typeof validators[name] !== 'undefined'
    && force !== true
  ) {
    throw new Error('Not adding validator because ' + name + ' already exists');
  }

  if (name === 'addValidator') {
    throw new Error('Cannot override addValidator');
  }

  validators[name] = func;
}

iz.register = function (validators, force) {
  Object.keys(validators).forEach((name) => {
    registerValidator(name, validators[name], force);
  });
};

module.exports = iz;

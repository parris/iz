const izGetObjectClass = require('../utils/nameOfClass');

module.exports = function izOfType(obj, type) {
  if (typeof obj === 'object' && typeof type === 'function') {
    if (type.displayName && obj.constructor) {
      return obj.constructor.displayName === type.displayName;
    } else {
      return obj instanceof type;
    }
  }

  if (typeof obj === 'object' && typeof obj.length === 'undefined' && typeof type === 'string') {
    if (izGetObjectClass(obj) === type) {
      return true;
    }
  }

  return false;
};

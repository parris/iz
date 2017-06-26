const izGetObjectClass = require('../utils/nameOfClass');

module.exports = function izOfType(obj, type) {
  if (obj.displayName) {
    return obj.displayName === type;
  }

  if (typeof obj === 'object' && typeof obj.length === 'undefined' && typeof type === 'string') {
    if (izGetObjectClass(obj) === type) {
      return true;
    }
  }

  return false;
};

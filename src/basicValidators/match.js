module.exports = function izMatch(value, checker, flags) {
  if (checker instanceof RegExp) {
    return checker.test(value);
  }

  if (typeof checker === 'string') {
    return (new RegExp(checker, flags)).test(value);
  }

  return false;
};

module.exports = function izBetween(val, start, end) {
  if ((typeof val === 'object' || typeof val === 'function') ||
    (typeof start === 'object' || typeof start === 'function') ||
    (typeof end === 'object' || typeof end === 'function')) {
    return false;
  }

  if ((val >= start && val <= end)) {
    return true;
  }
  return false;
};

module.exports = function izString(value) {
  return typeof value === 'string' || value instanceof String;
};

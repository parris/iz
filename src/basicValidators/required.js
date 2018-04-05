module.exports = function izRequired(value, allowEmptyString) {
  return allowEmptyString === true ? !!value || value === '' : !!value;
};

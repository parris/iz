module.exports = function izAlphaNumeric(value) {
  return (/^[a-z0-9]+$/i).test(value);
};

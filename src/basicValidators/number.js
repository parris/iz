module.exports = function izNumber(val) {
  if ((typeof val === 'string' || typeof val === 'number') && !isNaN(val % 1)) {
    return true;
  }
  return false;
};

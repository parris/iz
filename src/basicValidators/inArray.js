module.exports = function izInArray(value, arr) {
  if (typeof arr !== 'object' || typeof arr.indexOf === 'undefined') {
    return false;
  }

  if (arr.indexOf(value) !== -1) {
    return true;
  }
  return false;
}

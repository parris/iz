module.exports = function izMultiple(num, multipleOf) {
  if (typeof num !== 'number' || typeof multipleOf !== 'number') {
    return false;
  }
  let res;
  let factor = ((multipleOf | 0) !== multipleOf) ? Math.pow(10, multipleOf.toString().split('.').pop().length) : 1;

  if (factor > 1) {
    let factorName = ((num | 0) !== num) ? Math.pow(10, num.toString().split('.').pop().length) : 1;

    if (factorName > factor) {
      res = true;
    } else {
      res = Math.round(factor * num) % (factor * multipleOf);
    }
  } else {
    res = num % multipleOf;
  }

  return !res;
};

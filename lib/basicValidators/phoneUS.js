const izInt = require('./int');

module.exports = function izPhone(str) {
  var cleanedStr = '',
    numbers = [];
  if (typeof str === 'string') {
    cleanedStr = str.replace(/[^x0-9]/g, '');
    numbers = cleanedStr.split('x');
    //first and last array elements are numbers, this allows for multiple x's between the phone number and extension (if exists)
    if (
      numbers.length > 0 && izInt(numbers[0]) &&  // has at least 1 value in the array and it is an integer
      (numbers[0].length === 10 || numbers[0].length === 11) && // it has an extension with or without country code
      izInt(numbers.pop())
    ) { //if it is has an extension it is a valid number
      return true;
    }
  }
  return false;
};

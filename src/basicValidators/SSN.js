const izInt = require('./int');

module.exports = function izSsn(str) {
  var cleanedStr = '';
  if (typeof str === 'string') {
    cleanedStr = str.replace(/[^0-9]/g, '');
    //There are varying rules depending on date of issuance. I will say that having 9 digits is all that is needed for now.
    if (izInt(cleanedStr) && (cleanedStr.length === 9)) {
      return true;
    }
  }
  return false;
};

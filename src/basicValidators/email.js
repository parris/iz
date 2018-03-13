const isEmail = require('isemail');

/**
 * There is no minimal complexity email validation. If you require this you'll
 * also get the isEmail package, which does a great job at validation.
 *
 * @param value
 * @return {Boolean}
 */
module.exports =function izEmail(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return isEmail.validate(value, { errorLevel: false, minDomainAtoms: 2 });
};

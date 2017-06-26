/**
 * I liked the minimal complexity this Regex had
 * http://www.w3resource.com/javascript/form/email-validation.php
 *
 * @param value
 * @return {Boolean}
 */
module.exports =function izEmail(value) {
  return !(typeof value !== 'string') &&
    (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(value);
};

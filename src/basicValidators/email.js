/**
 * I minimal complexity email regex. It doesn't capture every illegal
 * variation, but should produce pretty good results. See the spec
 * test file for more details.
 *
 * @param value
 * @return {Boolean}
 */
module.exports =function izEmail(value) {
  // ^([^\p{P}\p{S}]|\+)+ - starts with anything other than a special char or a + sign, at least once
  // @ - we require an at symbol at some point
  // [^\p{P}\p{S}]+ - anything other than a special character at least once
  // .* - followed by anything
  // \.[^\p{P}\p{S}]+$ - ends with a period followed by any non special character
  return !(typeof value !== 'string') &&
    (/^([^\p{P}\p{S}]|\+)+@[^\p{P}\p{S}]+.*\.[^\p{P}\p{S}]+$/).test(value);
};

const iz = require('../src/iz');

describe('Iz', function() {
  it('can be created', () => {
    (typeof (iz(5)) === 'object').should.be.ok;
    (typeof iz === 'function').should.be.ok;
  });

  it('has prototyped methods and can call one', function () {
    (typeof iz(5).alphaNumeric === 'function').should.be.ok;
    (iz(5).alphaNumeric().valid).should.be.ok;
    //with parameters
    (iz(5).between(3, 5).valid).should.be.ok;
  });

  it('allows methods to be chained together', function () {
    iz(5).alphaNumeric().between(3, 5).int().valid.should.be.ok;
  });

  it('tells you what fails when you chain', function () {
    const result = iz(5).between(1, 2).boolean();
    result.valid.should.not.be.ok;
    result.errors.should.containEql('between');
    result.errors.should.containEql('boolean');
  });

  it('accepts an error message list', function () {
    const errors = {
      between: 'Is not between',
      boolean: 'Is not Boolean'
    };
    const result = iz(5, errors).between(1, 2).boolean();

    result.valid.should.not.be.ok;
    result.errors.should.containEql(errors.between);
    result.errors.should.containEql(errors.boolean);
  });

  it('allows to notXYZ validations', function () {
    iz(5).notBetween(10, 20).valid.should.be.ok;
    iz(5).notEmail().valid.should.be.ok;
    iz('bob@yahoo').notEmail().valid.should.not.be.ok;
  });

  it('accepts errors for not validations', function () {
    const expected = 'Your value needs to not be between 4 and 6, it is currently 5!';
    const error_messages = {
      notBetween: 'Your value needs to not be between {{ 1 }} and {{2 }}, it is currently {{0}}!'
    };

    iz(5, error_messages).notBetween(4, 6).errors.should.containEql(expected);
    iz(5).notBetween(4, 6).errors.should.containEql('notBetween');
  });

  it('allows switching between not and normal validations', function () {
    iz(5).between(4, 6).notIp().int().valid.should.be.ok;
  });

  it('handles required/non-required values', function () {
    iz('').between(4, 6).valid.should.be.ok;
    iz(null).between(4, 6).valid.should.be.ok;
    iz(undefined).between(4, 6).valid.should.be.ok;
    iz(3).between(4, 6).valid.should.not.be.ok;
    iz(5).between(4, 6).valid.should.be.ok;
  });
});

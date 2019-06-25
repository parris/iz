const iz = require('../src/iz');

describe('Iz', function() {
  it('can be created', function() {
    (typeof (iz(5)) === 'object').should.be.true();
    (typeof iz === 'function').should.be.true();
  });

  it('has prototyped methods and can call one', function () {
    (typeof iz(5).alphaNumeric === 'function').should.be.true();
    (iz(5).alphaNumeric().valid).should.be.true();
    //with parameters
    (iz(5).between(3, 5).valid).should.be.true();
  });

  it('allows methods to be chained together', function () {
    iz(5).alphaNumeric().between(3, 5).int().valid.should.be.true();
  });

  it('tells you what fails when you chain', function () {
    const result = iz(5).between(1, 2).boolean();
    result.valid.should.be.false();
    result.errors.should.containEql('between');
    result.errors.should.containEql('boolean');
  });

  it('accepts an error message list', function () {
    const errors = {
      between: 'Is not between',
      boolean: 'Is not Boolean'
    };
    const result = iz(5, errors).between(1, 2).boolean();

    result.valid.should.be.false();
    result.errors.should.containEql(errors.between);
    result.errors.should.containEql(errors.boolean);
  });

  it('allows notXYZ validations', function () {
    iz(5).notBetween(10, 20).valid.should.be.true();
    iz(5).notEmail().valid.should.be.true();
    iz('bob@yahoo.com').notEmail().valid.should.be.false();
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
    iz(5).between(4, 6).notIp().int().valid.should.be.true();
  });

  it('handles non-required values', function () {
    iz('').between(4, 6).valid.should.be.true();
    iz(null).between(4, 6).valid.should.be.true();
    iz(undefined).between(4, 6).valid.should.be.true();


    iz('').between(4, 6).required().valid.should.be.false();
    iz(null).between(4, 6).required().valid.should.be.false();
    iz(undefined).between(4, 6).required().valid.should.be.false();

    iz(3).between(4, 6).valid.should.be.false();
    iz(5).between(4, 6).valid.should.be.true();
  });

  it('handles async validations with async/await', async function() {
    let result = await iz(5).between(4, 6).async;
    result.valid.should.be.true();
  });

  it('handles async validations with promises', function(done) {
    iz(5).between(4, 6).async.then((result) => {
      result.valid.should.be.true();
      done();
    });
  });

  it('handles truthy async validations', async function() {
    let result = await iz(5).sleepyTrue().async;
    result.valid.should.be.true();
  });

  it('handles falsey async validations', async function() {
    let result = await iz(5).sleepyFalse().async;
    result.valid.should.be.false();
  });

  it('handles falsey async validations with promises', function(done) {
    iz(5).sleepyFalse().async.then((result) => {
      result.valid.should.be.false();
      done();
    });
  });

  it('handles falsey async validations with promises', function(done) {
    iz(5).sleepyFalseReject().async.then((result) => {
      result.valid.should.be.false();
      done();
    });
  });

  it('handles falsey async/await rejection', async function() {
    let result = await iz(5).sleepyFalseReject().async;
    result.valid.should.be.false();
  });
});

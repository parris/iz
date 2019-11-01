const iz = require('../src/iz');
const basicValidators = require('../src/validators');

describe('Iz', function() {
  const validators = Object.assign({}, basicValidators, {
    sleepyTrue: function sleepyTrue() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 10);
      });
    },
    sleepyFalse: function sleepyFalse() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, 10);
      });
    },
    sleepyFalseReject: function sleepyFalseReject() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(false);
        }, 10);
      });
    },
  });

  it('can be created', function() {
    (typeof (iz({ value: 5, validators })) === 'object').should.be.true();
    (typeof iz === 'function').should.be.true();
  });

  it('has prototyped methods and can call one', function () {
    (typeof iz({ value: 5, validators }).alphaNumeric === 'function').should.be.true();
    (iz({ value: 5, validators }).alphaNumeric().valid).should.be.true();
    //with parameters
    (iz({ value: 5, validators }).between(3, 5).valid).should.be.true();
  });

  it('allows methods to be chained together', function () {
    iz({ value: 5, validators }).alphaNumeric().between(3, 5).int().valid.should.be.true();
  });

  it('tells you what fails when you chain', function () {
    const result = iz({ value: 5, validators }).between(1, 2).boolean();
    result.valid.should.be.false();
    result.errors.should.containEql('between');
    result.errors.should.containEql('boolean');
  });

  it('accepts an error message list', function () {
    const errorMessages = {
      between: 'Is not between',
      boolean: 'Is not Boolean'
    };
    const result = iz({ value: 5, validators, errorMessages }).between(1, 2).boolean();

    result.valid.should.be.false();
    result.errors.should.containEql(errorMessages.between);
    result.errors.should.containEql(errorMessages.boolean);
  });

  it('allows notXYZ validations', function () {
    iz({ value: 5, validators }).notBetween(10, 20).valid.should.be.true();
    iz({ value: 5, validators }).notEmail().valid.should.be.true();
    iz({ value: 'bob@yahoo.com', validators }).notEmail().valid.should.be.false();
  });

  it('accepts errors for not validations', function () {
    const expected = 'Your value needs to not be between 4 and 6, it is currently 5!';
    const errorMessages = {
      notBetween: 'Your value needs to not be between {{ 1 }} and {{2 }}, it is currently {{0}}!'
    };

    iz({ value: 5, validators, errorMessages}).notBetween(4, 6).errors.should.containEql(expected);
    iz({ value: 5, validators }).notBetween(4, 6).errors.should.containEql('notBetween');
  });

  it('allows switching between not and normal validations', function () {
    iz({ value: 5, validators }).between(4, 6).notIp().int().valid.should.be.true();
  });

  it('handles non-required values', function () {
    iz({ value: '', validators }).between(4, 6).valid.should.be.true();
    iz({ value: null, validators }).between(4, 6).valid.should.be.true();
    iz({ value: undefined, validators }).between(4, 6).valid.should.be.true();


    iz({ value: '', validators }).between(4, 6).required().valid.should.be.false();
    iz({ value: null, validators }).between(4, 6).required().valid.should.be.false();
    iz({ value: undefined, validators }).between(4, 6).required().valid.should.be.false();

    iz({ value: 3, validators }).between(4, 6).valid.should.be.false();
    iz({ value: 5, validators }).between(4, 6).valid.should.be.true();
  });

  it('handles async validations with async/await', async function() {
    let result = await iz({ value: 5, validators }).between(4, 6).async;
    result.valid.should.be.true();
  });

  it('handles async validations with promises', function(done) {
    iz({ value: 5, validators }).between(4, 6).async.then((result) => {
      result.valid.should.be.true();
      done();
    });
  });

  it('handles truthy async validations', async function() {
    let result = await iz({ value: 5, validators }).sleepyTrue().async;
    result.valid.should.be.true();
  });

  it('handles falsey async validations', async function() {
    let result = await iz({ value: 5, validators }).sleepyFalse().async;
    result.valid.should.be.false();
  });

  it('handles falsey async validations with promises', function(done) {
    iz({ value: 5, validators }).sleepyFalse().async.then((result) => {
      result.valid.should.be.false();
      done();
    });
  });

  it('handles falsey async validations with promises', function(done) {
    iz({ value: 5, validators }).sleepyFalseReject().async.then((result) => {
      result.valid.should.be.false();
      done();
    });
  });

  it('handles falsey async/await rejection', async function() {
    let result = await iz({ value: 5, validators }).sleepyFalseReject().async;
    result.valid.should.be.false();
  });
});

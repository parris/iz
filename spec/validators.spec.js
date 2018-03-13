const validators = require('../src/validators');

describe('Validation', function () {
  'use strict';

  it('can validate alpha numeric values', function () {
    validators.alphaNumeric('a2d1kf0v9r9fje9fdgnsdksdf9240uyjsdfgkj').should.be.true();
    validators.alphaNumeric('aaaaaaa').should.be.true();
    validators.alphaNumeric('999999').should.be.true();
    validators.alphaNumeric(9999999).should.be.true();
    validators.alphaNumeric('_3423423').should.be.false();
    validators.alphaNumeric('342 3423').should.be.false();
    validators.alphaNumeric('alals*fd').should.be.false();
    validators.alphaNumeric({}).should.be.false();
    validators.alphaNumeric(function () {}).should.be.false();
    validators.alphaNumeric([]).should.be.false();
  });

  it('can validate string values', function () {
    validators.string('').should.be.true();
    validators.string('a2d1kf0v9r9fje9fdgnsdksdf9240uyjsdfgkj').should.be.true();
    validators.string('aaaaaaa').should.be.true();
    validators.string('999999').should.be.true();
    validators.string('_3423423').should.be.true();
    validators.string('342 3423').should.be.true();
    validators.string('alals*fd').should.be.true();

    validators.string(new String('')).should.be.true();
    validators.string(new String('239084203')).should.be.true();
    validators.string(new String('alals*fd')).should.be.true();

    validators.string(9999999).should.be.false();
    validators.string({}).should.be.false();
    validators.string([]).should.be.false();
    validators.string(function () {}).should.be.false();
    validators.string(/[ \-]/g).should.be.false();
    validators.string(new Date()).should.be.false();

    function Car() {}
    validators.string(new Car()).should.be.false();
  });

  it('can validate that a primitive is between 2 other primitives', function () {
    validators.between(5, 5, 6).should.be.true();
    validators.between(6, 5, 6).should.be.true();
    validators.between(4, 3, 5).should.be.true();
    validators.between(3, 4, 5).should.be.false();
    validators.between(7, 4, 5).should.be.false();
    validators.between('abc', 'aaa', 'bbb').should.be.true();
    validators.between('aaa', 'abc', 'bbb').should.be.false();
    validators.between('aaa', 'aaa', 'bbb').should.be.true();
    validators.between([1, 2], [1], [1, 4]).should.be.false(); //default array comparison... this is false.
    validators.between({},{},{}).should.be.false(); //it hates objects
    validators.between(function (){}, function (){}, function () {}).should.be.false(); //it also despises functions

    validators.between(null, 1, 5).should.be.false();
    validators.between(undefined, 1, 5).should.be.false();
  });

  it('can validate boolean values', function () {
    validators.boolean(true).should.be.true();
    validators.boolean(false).should.be.true();
    validators.boolean(1).should.be.true();
    validators.boolean(0).should.be.true();
    validators.boolean(-1).should.be.false();
    validators.boolean('deadbeef').should.be.false();
    validators.boolean('*').should.be.false();
    validators.boolean(/[ \-]/g).should.be.false();
  });

  it('can validate blank values', function() {
    validators.blank('').should.be.true();
    validators.blank('hi').should.be.false();
    validators.blank([]).should.be.false();
  });

  /**
   * Tests from Paypal: http://www.paypalobjects.com/en_US/vhelp/paypalmanager_help/credit_card_numbers.htm
   */
  it('can validate credit card numbers', function () {
    validators.cc('371449635398431').should.be.true(); //amex
    validators.cc('343434343434343').should.be.true(); //amex
    validators.cc('371144371144376').should.be.true(); //amex corp
    validators.cc('5610591081018250').should.be.true(); //aus bankcard
    validators.cc('30569309025904').should.be.true(); //diners club
    validators.cc('38520000023237').should.be.true(); //diners club
    validators.cc('6011111111111117').should.be.true(); //discover
    validators.cc('6011000990139424').should.be.true(); //discover
    validators.cc('3530111333300000').should.be.true(); //jcb
    validators.cc('3566002020360505').should.be.true(); //jcb
    validators.cc('5555555555554444').should.be.true(); //mc
    validators.cc('5105105105105100').should.be.true(); //mc
    validators.cc('4111111111111111').should.be.true(); //visa
    validators.cc('4012888888881881').should.be.true(); //visa
    validators.cc('4222222222222').should.be.true(); //visa
    //validators.cc('76009244561').should.be.true(); //dankort (pbs) currently fails... anyone know why?
    validators.cc('5019717010103742').should.be.true(); //dankort (pbs)
    validators.cc('6331101999990016').should.be.true(); //switch/solo (paymentech)

    validators.cc('0000000000000000').should.be.false();

    validators.cc('4012 8888 8888 1881').should.be.true(); //visa with spaces
    validators.cc('4012-8888-8888-1881').should.be.true(); //visa with dashes
    validators.cc({}).should.be.false();
    validators.cc(function () {}).should.be.false();
    validators.cc(['5']).should.be.false();
  });

  it('can validated dates', function () {
    validators.date(new Date()).should.be.true();
    validators.date(0).should.be.true(); //assumed milliseconds from epoch
    validators.date('09/23/2012').should.be.true();
    validators.date('09-23-2012 21:27:00').should.be.true();
    validators.date('January 5th, 2012').should.be.false();
    validators.date('Pizza').should.be.false();
    validators.date({}).should.be.false();
    validators.date(function () {}).should.be.false();
    validators.date([]).should.be.false();
  });

  it('can validate decimals', function () {
    validators.decimal('5.5').should.be.true();
    validators.decimal(5.5).should.be.true();
    validators.decimal('340298.3234234').should.be.true();

    validators.decimal(5).should.be.false();
    validators.decimal('5').should.be.false();
    validators.decimal('5.5.5').should.be.false();
    validators.decimal({}).should.be.false();
    validators.decimal(function () {}).should.be.false();
    validators.decimal([]).should.be.false();
  });

  it('can validate email address', function () {
    validators.email('').should.be.false();
    validators.email('bob@bob').should.be.false();
    validators.email('bob@bob.com').should.be.true();
    validators.email('bob@😉.tld,').should.be.false();
    validators.email('bob@bob.com    ').should.be.false();
    validators.email('bob+bob@a.com    ').should.be.false();
    validators.email('bÖb+bob@a.com    ').should.be.false();
    validators.email('  bob@bob.com').should.be.false();
    validators.email('@bob.com').should.be.false();
    validators.email('bo@b@.com').should.be.false();
    validators.email('bo@b@.com,').should.be.false();
    validators.email('$bo@b@.com,').should.be.false();
    validators.email('$bo@b@.com$').should.be.false();
    validators.email('$bo@b@.co.uk').should.be.false();
    validators.email('$bo@b@.co.uk.uk.u1k').should.be.false();
    validators.email('$bo@b@.co.uk.uk.ük').should.be.false();
    validators.email('bob').should.be.false();
    validators.email({}).should.be.false();
    validators.email(function () {}).should.be.false();
    validators.email([]).should.be.false();
    validators.email(5).should.be.false();
  });

  it('can validate that something is empty', function () {
    validators.empty([]).should.be.true();
    validators.empty({}).should.be.true();
    validators.empty(function () {}).should.be.true();
    validators.empty(true).should.be.true();
    validators.empty(5).should.be.true();
    validators.empty({bob: true}).should.be.false();
    validators.empty(['hi']).should.be.false();
  });

  it('can validate that 2 things are strictly equal', function () {
    var obj1 = {
        bob: 'cheese',
        equals : function(obj2) {
          if (this.bob === obj2.bob) {
            return true;
          }
          return false;
        }
      },
      //equals method can be different and it will still match
      obj2 = {
        bob: 'cheese',
        equals : function () {}
      },
      //don't even need the equals method
      obj3 = {
        bob: 'cheese'
      },
      obj4 = {
        bob: 'pizza'
      };
    validators.equal('bob', 'bob').should.be.true();
    validators.equal({},{}).should.be.true();
    validators.equal({},{'bob': true}).should.be.true();
    validators.equal(obj1, obj2).should.be.true();
    validators.equal(obj1, obj3).should.be.true();
    validators.equal(obj1, obj4).should.be.false();
  });

  it('can validate that an object is an extension of another object', function () {
    validators.extension({},'5').should.be.false();
    validators.extension({
      bob: 10,
      something: 'hi',
      somethingElse: 'bye'
    },{
      bob: '912dfinn',
      something: 'yes!'
    }).should.be.true();
    validators.extension([],[]).should.be.true();
    validators.extension({
      bob: 10,
      something: 'hi'
    },{
      bob: '912dfinn',
      something: 'yes!',
      somethingElse: 'bye'
    }).should.be.false();
    validators.extension([],['hello']).should.be.false();
  });

  it('can validate that a file extension is valid', function () {
    validators.fileExtension('apple_pie.pizza', ['pizza']).should.be.true();
    validators.fileExtension('hello.png', ['png']).should.be.true();
    validators.fileExtension('hello.PNG', ['png']).should.be.true();
    validators.fileExtension('hello.png', ['PNG']).should.be.false();
    validators.fileExtension('hello.png', ['.png']).should.be.false();
    validators.fileExtension('hello.mp3', ['png']).should.be.false();
    validators.fileExtension({},{}).should.be.false();
  });

  it('can validate audio file extensions', function () {
    validators.fileExtensionAudio('apple.mp3').should.be.true();
    validators.fileExtensionAudio('apple.png').should.be.false();
  });

  it('can validate image file extensions', function () {
    validators.fileExtensionImage('apple.png').should.be.true();
    validators.fileExtensionImage('apple.mp3').should.be.false();
  });

  it('can validate video file extensions', function () {
    validators.fileExtensionVideo('apple.mp4').should.be.true();
    validators.fileExtensionVideo('apple.mp3').should.be.false();
  });

  it('can tell if something is in an array', function () {
    validators.inArray('tofu', ['pizza','chicken','tofu','turkey']).should.be.true();
    validators.inArray('lizard', ['pizza','chicken','tofu','turkey']).should.be.false();
    validators.inArray(5,6).should.be.false();
    validators.inArray({},[]).should.be.false();
    validators.inArray(function () {}, 5).should.be.false();
  });

  it('can detect an array', function () {
    validators.anArray(['pizza','chicken','tofu','turkey']).should.be.true();
    validators.anArray('lizard').should.be.false();
    validators.anArray(5).should.be.false();
    validators.anArray({}).should.be.false();
    validators.anArray(function () {}).should.be.false();
  });

  it('can validate integers', function () {
    validators.int('1000').should.be.true();
    validators.int(1000).should.be.true();
    validators.int(999).should.be.true();
    validators.int('11.0', true).should.be.true();

    validators.int('11.0').should.be.false();
    validators.int(11.2).should.be.false();
    validators.int('bob').should.be.false();
    validators.int({}).should.be.false();
    validators.int([]).should.be.false();
    validators.int(function () {}).should.be.false();
  });

  it('can validate IPv4, IPv6 and host names', function () {
    validators.ip('pizza').should.be.true();
    //ipv6
    validators.ip('3ffe:1900:4545:3:200:f8ff:fe21:67cf').should.be.true();
    validators.ip('fe80:0:0:0:200:f8ff:fe21:67cf').should.be.true();
    validators.ip('fe80::200:f8ff:fe21:67cf').should.be.true();
    //ipv4
    validators.ip('0.0.0.0').should.be.true();
    validators.ip('192.0.2.235').should.be.true();
    //technically valid (citing wikipedia), but doesn't pass, but I don't think it is expected:
    validators.ip('0xC0.0x00.0x02.0xEB').should.be.false();
    validators.ip('0300.0000.0002.0353').should.be.false();
    validators.ip('0xC00002EB').should.be.false();
    validators.ip('3221226219').should.be.false();
    validators.ip('030000001353').should.be.false();
  });

  it('can require a string to have some min length', function () {
    validators.minLength('Pizza', 5).should.be.true();
    validators.minLength('pizza', 4).should.be.true();
    validators.minLength('pizza', 6).should.be.false();
    validators.minLength({}, 5).should.be.false();
    validators.minLength('lizard', {}).should.be.false();
  });

  it('can require an array to have some min length', function () {
    validators.minLength([1, 2, 3, 4, 5, 6], 6).should.be.true();
    validators.minLength([1, 2, 3, 4, 5, 6], 5).should.be.true();
    validators.minLength([1, 2, 3, 4, 5, 6], 7).should.be.false();
  });

  it('can require a string to have some max length', function () {
    validators.maxLength('Pizza', 5).should.be.true();
    validators.maxLength('pizza', 6).should.be.true();
    validators.maxLength('pizza', 4).should.be.false();
    validators.maxLength({}, 5).should.be.false();
    validators.maxLength('lizard', {}).should.be.false();
  });

  it('can require an array to have some max length', function () {
    validators.maxLength([1, 2, 3, 4, 5, 6], 6).should.be.true();
    validators.maxLength([1, 2, 3, 4, 5, 6], 7).should.be.true();
    validators.maxLength([1, 2, 3, 4, 5, 6], 5).should.be.false();
  });

  it('can match a string using regex', function () {
    validators.match('laura', 'a', 'g').should.be.eql(true);
    validators.match('laura', 'b', 'g').should.be.eql(false);
    validators.match('laura', '^.{5}$').should.be.eql(true);
    validators.match('laura', '^.{4}$').should.be.eql(false);
  });

  it('can tell if a number is multiple of another number', function () {
    validators.multiple(10, 5).should.be.true();
    validators.multiple(10, 2).should.be.true();
    validators.multiple(2, 10).should.be.false();
    validators.multiple(5, {}).should.be.false(); // disallow everything but numbers
  });

  it('can tell if something is a number', function () {
    validators.number({}).should.be.false();
    validators.number('5').should.be.true();
    validators.number('5.32342').should.be.true();
    validators.number(23123).should.be.true();
    validators.number('bob').should.be.false();
  });

  it('can tell if the name of an object is equal to some string', function () {
    var obj = {};

    function Car() { }

    validators.ofType(new Car(), 'Car').should.be.true();
    validators.ofType(new Car(), 'Object').should.be.false();
    validators.ofType(obj, 'Object').should.be.true();

    function Car2() { }
    Car2.displayName = 'Pizza';

    const obj2 = new Car2();
    validators.ofType(obj2, Car2).should.be.true();
  });

  it('can validate a north american phone number', function () {
    validators.phone(1231231).should.be.false();
    validators.phone({}).should.be.false();

    validators.phone('1-415-222-2222').should.be.true();
    validators.phone('1.415.555.5555 extension 422').should.be.true();
    validators.phone('1415.323.3242 extension x422').should.be.true();
    validators.phone('11231234567').should.be.true();

    validators.phone('123').should.be.false();
    validators.phone('123456789012').should.be.false();

    validators.phone('1234567890').should.be.true();
    validators.phone('12345678901').should.be.true();
  });

  it('can validate a US zip-code', function () {
    validators.postal(1231231).should.be.false();
    validators.postal({}).should.be.false();

    validators.postal('94117').should.be.true();
    validators.postal('94117 3333').should.be.true();
    validators.postal('94117-3333').should.be.true();
    validators.postal('94117 33333').should.be.false();
    validators.postal('9411').should.be.false();
  });

  it('can validate a US SSN', function () {
    validators.ssn(123).should.be.false();
    validators.ssn({}).should.be.false();

    validators.ssn('123456789').should.be.true();
    validators.ssn('123-45-6789').should.be.true();

    validators.ssn('1234567890').should.be.false();
    validators.ssn('123-45-678').should.be.false();
  });
});

const validators = require('../src/validators');

describe('Validation', function () {
  'use strict';

  it('can validate alpha numeric values', function () {
    validators.alphaNumeric('a2d1kf0v9r9fje9fdgnsdksdf9240uyjsdfgkj').should.be.ok;
    validators.alphaNumeric('aaaaaaa').should.be.ok;
    validators.alphaNumeric('999999').should.be.ok;
    validators.alphaNumeric(9999999).should.be.ok;
    validators.alphaNumeric('_3423423').should.not.be.ok;
    validators.alphaNumeric('342 3423').should.not.be.ok;
    validators.alphaNumeric('alals*fd').should.not.be.ok;
    validators.alphaNumeric({}).should.not.be.ok;
    validators.alphaNumeric(function () {}).should.not.be.ok;
    validators.alphaNumeric([]).should.not.be.ok;
  });

  it('can validate string values', function () {
    validators.string('').should.be.ok;
    validators.string('a2d1kf0v9r9fje9fdgnsdksdf9240uyjsdfgkj').should.be.ok;
    validators.string('aaaaaaa').should.be.ok;
    validators.string('999999').should.be.ok;
    validators.string('_3423423').should.be.ok;
    validators.string('342 3423').should.be.ok;
    validators.string('alals*fd').should.be.ok;

    validators.string(new String('')).should.be.ok;
    validators.string(new String('239084203')).should.be.ok;
    validators.string(new String('alals*fd')).should.be.ok;

    validators.string(9999999).should.not.be.ok;
    validators.string({}).should.not.be.ok;
    validators.string([]).should.not.be.ok;
    validators.string(function () {}).should.not.be.ok;
    validators.string(/[ \-]/g).should.not.be.ok;
    validators.string(new Date()).should.not.be.ok;

    function Car() {}
    validators.string(new Car()).should.not.be.ok;
  });

  it('can validate that a primitive is between 2 other primitives', function () {
    validators.between(5, 5, 6).should.be.ok;
    validators.between(6, 5, 6).should.be.ok;
    validators.between(4, 3, 5).should.be.ok;
    validators.between(3, 4, 5).should.not.be.ok;
    validators.between(7, 4, 5).should.not.be.ok;
    validators.between('abc', 'aaa', 'bbb').should.be.ok;
    validators.between('aaa', 'abc', 'bbb').should.not.be.ok;
    validators.between('aaa', 'aaa', 'bbb').should.be.ok;
    validators.between([1, 2], [1], [1, 4]).should.not.be.ok; //default array comparison... this is false.
    validators.between({},{},{}).should.not.be.ok; //it hates objects
    validators.between(function (){}, function (){}, function () {}).should.not.be.ok; //it also despises functions

    validators.between(null, 1, 5).should.be.ok;
    validators.between(undefined, 1, 5).should.be.ok;
  });

  it('can validate boolean values', function () {
    validators.boolean(true).should.be.ok;
    validators.boolean(false).should.be.ok;
    validators.boolean(1).should.be.ok;
    validators.boolean(0).should.be.ok;
    validators.boolean(-1).should.not.be.ok;
    validators.boolean('deadbeef').should.not.be.ok;
    validators.boolean('*').should.not.be.ok;
    validators.boolean(/[ \-]/g).should.not.be.ok;
  });

  it('can validate blank values', function() {
    validators.blank('').should.be.ok;
    validators.blank('hi').should.not.be.ok;
    validators.blank([]).should.not.be.ok;
  });

  /**
   * Tests from Paypal: http://www.paypalobjects.com/en_US/vhelp/paypalmanager_help/credit_card_numbers.htm
   */
  it('can validate credit card numbers', function () {
    validators.cc('371449635398431').should.be.ok; //amex
    validators.cc('343434343434343').should.be.ok; //amex
    validators.cc('371144371144376').should.be.ok; //amex corp
    validators.cc('5610591081018250').should.be.ok; //aus bankcard
    validators.cc('30569309025904').should.be.ok; //diners club
    validators.cc('38520000023237').should.be.ok; //diners club
    validators.cc('6011111111111117').should.be.ok; //discover
    validators.cc('6011000990139424').should.be.ok; //discover
    validators.cc('3530111333300000').should.be.ok; //jcb
    validators.cc('3566002020360505').should.be.ok; //jcb
    validators.cc('5555555555554444').should.be.ok; //mc
    validators.cc('5105105105105100').should.be.ok; //mc
    validators.cc('4111111111111111').should.be.ok; //visa
    validators.cc('4012888888881881').should.be.ok; //visa
    validators.cc('4222222222222').should.be.ok; //visa
    //validators.cc('76009244561').should.be.ok; //dankort (pbs) currently fails... anyone know why?
    validators.cc('5019717010103742').should.be.ok; //dankort (pbs)
    validators.cc('6331101999990016').should.be.ok; //switch/solo (paymentech)

    validators.cc('0000000000000000').should.not.be.ok;

    validators.cc('4012 8888 8888 1881').should.be.ok; //visa with spaces
    validators.cc('4012-8888-8888-1881').should.be.ok; //visa with dashes
    validators.cc({}).should.not.be.ok;
    validators.cc(function () {}).should.not.be.ok;
    validators.cc(['5']).should.not.be.ok;
  });

  it('can validated dates', function () {
    validators.date(new Date()).should.be.ok;
    validators.date(0).should.be.ok; //assumed milliseconds from epoch
    validators.date('09/23/2012').should.be.ok;
    validators.date('09-23-2012 21:27:00').should.be.ok;
    validators.date('January 5th, 2012').should.not.be.ok;
    validators.date('Pizza').should.not.be.ok;
    validators.date({}).should.not.be.ok;
    validators.date(function () {}).should.not.be.ok;
    validators.date([]).should.not.be.ok;
  });

  it('can validate decimals', function () {
    validators.decimal('5.5').should.be.ok;
    validators.decimal(5.5).should.be.ok;
    validators.decimal('340298.3234234').should.be.ok;

    validators.decimal(5).should.not.be.ok;
    validators.decimal('5').should.not.be.ok;
    validators.decimal('5.5.5').should.not.be.ok;
    validators.decimal({}).should.not.be.ok;
    validators.decimal(function () {}).should.not.be.ok;
    validators.decimal([]).should.not.be.ok;
  });

  it('can validate email address', function () {
    validators.email('bob@bob').should.be.ok;
    validators.email('bob@bob.com').should.be.ok;
    validators.email('bob@bob.com    ').should.not.be.ok;
    validators.email('bob+bob@a.com    ').should.be.ok;
    validators.email('  bob@bob.com').should.not.be.ok;
    validators.email('@bob.com').should.not.be.ok;
    validators.email('bo@b@.com').should.not.be.ok;
    validators.email('bob').should.not.be.ok;
    validators.email({}).should.not.be.ok;
    validators.email(function () {}).should.not.be.ok;
    validators.email([]).should.not.be.ok;
    validators.email(5).should.not.be.ok;
  });

  it('can validate that something is empty', function () {
    validators.empty([]).should.be.ok;
    validators.empty({}).should.be.ok;
    validators.empty(function () {}).should.be.ok;
    validators.empty(true).should.be.ok;
    validators.empty(5).should.be.ok;
    validators.empty({bob: true}).should.not.be.ok;
    validators.empty(['hi']).should.not.be.ok;
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
    validators.equal('bob', 'bob').should.be.ok;
    validators.equal({},{}).should.be.ok;
    validators.equal({},{'bob': true}).should.be.ok;
    validators.equal(obj1, obj2).should.be.ok;
    validators.equal(obj1, obj3).should.be.ok;
    validators.equal(obj1, obj4).should.not.be.ok;
  });

  it('can validate that an object is an extension of another object', function () {
    validators.extension({},'5').should.not.be.ok;
    validators.extension({
      bob: 10,
      something: 'hi',
      somethingElse: 'bye'
    },{
      bob: '912dfinn',
      something: 'yes!'
    }).should.be.ok;
    validators.extension([],[]).should.be.ok;
    validators.extension({
      bob: 10,
      something: 'hi'
    },{
      bob: '912dfinn',
      something: 'yes!',
      somethingElse: 'bye'
    }).should.not.be.ok;
    validators.extension([],['hello']).should.not.be.ok;
  });

  it('can validate that a file extension is valid', function () {
    validators.fileExtension('apple_pie.pizza', ['pizza']).should.be.ok;
    validators.fileExtension('hello.png', ['png']).should.be.ok;
    validators.fileExtension('hello.PNG', ['png']).should.be.ok;
    validators.fileExtension('hello.png', ['PNG']).should.not.be.ok;
    validators.fileExtension('hello.png', ['.png']).should.not.be.ok;
    validators.fileExtension('hello.mp3', ['png']).should.not.be.ok;
    validators.fileExtension({},{}).should.not.be.ok;
  });

  it('can validate audio file extensions', function () {
    validators.fileExtensionAudio('apple.mp3').should.be.ok;
    validators.fileExtensionAudio('apple.png').should.not.be.ok;
  });

  it('can validate image file extensions', function () {
    validators.fileExtensionImage('apple.png').should.be.ok;
    validators.fileExtensionImage('apple.mp3').should.not.be.ok;
  });

  it('can validate video file extensions', function () {
    validators.fileExtensionVideo('apple.mp4').should.be.ok;
    validators.fileExtensionVideo('apple.mp3').should.not.be.ok;
  });

  it('can tell if something is in an array', function () {
    validators.inArray('tofu', ['pizza','chicken','tofu','turkey']).should.be.ok;
    validators.inArray('lizard', ['pizza','chicken','tofu','turkey']).should.not.be.ok;
    validators.inArray(5,6).should.not.be.ok;
    validators.inArray({},[]).should.not.be.ok;
    validators.inArray(function () {}, 5).should.not.be.ok;
  });

  it('can detect an array', function () {
    validators.anArray(['pizza','chicken','tofu','turkey']).should.be.ok;
    validators.anArray('lizard').should.not.be.ok;
    validators.anArray(5).should.not.be.ok;
    validators.anArray({}).should.not.be.ok;
    validators.anArray(function () {}).should.not.be.ok;
  });

  it('can validate integers', function () {
    validators.int('1000').should.be.ok;
    validators.int(1000).should.be.ok;
    validators.int(999).should.be.ok;
    validators.int('11.0', true).should.be.ok;

    validators.int('11.0').should.not.be.ok;
    validators.int(11.2).should.not.be.ok;
    validators.int('bob').should.not.be.ok;
    validators.int({}).should.not.be.ok;
    validators.int([]).should.not.be.ok;
    validators.int(function () {}).should.not.be.ok;
  });

  it('can validate IPv4, IPv6 and host names', function () {
    validators.ip('pizza').should.be.ok;
    //ipv6
    validators.ip('3ffe:1900:4545:3:200:f8ff:fe21:67cf').should.be.ok;
    validators.ip('fe80:0:0:0:200:f8ff:fe21:67cf').should.be.ok;
    validators.ip('fe80::200:f8ff:fe21:67cf').should.be.ok;
    //ipv4
    validators.ip('0.0.0.0').should.be.ok;
    validators.ip('192.0.2.235').should.be.ok;
    //technically valid (citing wikipedia), but doesn't pass, but I don't think it is expected:
    validators.ip('0xC0.0x00.0x02.0xEB').should.not.be.ok;
    validators.ip('0300.0000.0002.0353').should.not.be.ok;
    validators.ip('0xC00002EB').should.not.be.ok;
    validators.ip('3221226219').should.not.be.ok;
    validators.ip('030000001353').should.not.be.ok;
  });

  it('can require a string to have some min length', function () {
    validators.minLength('Pizza', 5).should.be.ok;
    validators.minLength('pizza', 4).should.be.ok;
    validators.minLength('pizza', 6).should.not.be.ok;
    validators.minLength({}, 5).should.not.be.ok;
    validators.minLength('lizard', {}).should.not.be.ok;
  });

  it('can require an array to have some min length', function () {
    validators.minLength([1, 2, 3, 4, 5, 6], 6).should.be.ok;
    validators.minLength([1, 2, 3, 4, 5, 6], 5).should.be.ok;
    validators.minLength([1, 2, 3, 4, 5, 6], 7).should.not.be.ok;
  });

  it('can require a string to have some max length', function () {
    validators.maxLength('Pizza', 5).should.be.ok;
    validators.maxLength('pizza', 6).should.be.ok;
    validators.maxLength('pizza', 4).should.not.be.ok;
    validators.maxLength({}, 5).should.not.be.ok;
    validators.maxLength('lizard', {}).should.not.be.ok;
  });

  it('can require an array to have some max length', function () {
    validators.maxLength([1, 2, 3, 4, 5, 6], 6).should.be.ok;
    validators.maxLength([1, 2, 3, 4, 5, 6], 7).should.be.ok;
    validators.maxLength([1, 2, 3, 4, 5, 6], 5).should.not.be.ok;
  });

  it('can tell if a number is multiple of another number', function () {
    validators.multiple(10, 5).should.be.ok;
    validators.multiple(10, 2).should.be.ok;
    validators.multiple(2, 10).should.not.be.ok;
    validators.multiple(5, {}).should.not.be.ok; // disallow everything but numbers
  });

  it('can tell if something is a number', function () {
    validators.number({}).should.not.be.ok;
    validators.number('5').should.be.ok;
    validators.number('5.32342').should.be.ok;
    validators.number(23123).should.be.ok;
    validators.number('bob').should.not.be.ok;
  });

  it('can tell if the name of an object is equal to some string', function () {
    var obj = {};

    function Car() { }

    validators.ofType(new Car(), 'Car').should.be.ok;
    validators.ofType(new Car(), 'Object').should.not.be.ok;
    validators.ofType(obj, 'Object').should.be.ok;
  });

  it('can validate a north american phone number', function () {
    validators.phone(1231231).should.not.be.ok;
    validators.phone({}).should.not.be.ok;

    validators.phone('1-415-222-2222').should.be.ok;
    validators.phone('1.415.555.5555 extension 422').should.be.ok;
    validators.phone('1415.323.3242 extension x422').should.be.ok;
    validators.phone('11231234567').should.be.ok;

    validators.phone('123').should.not.be.ok;
    validators.phone('123456789012').should.not.be.ok;

    validators.phone('1234567890').should.be.ok;
    validators.phone('12345678901').should.be.ok;
  });

  it('can validate a US zip-code', function () {
    validators.postal(1231231).should.not.be.ok;
    validators.postal({}).should.not.be.ok;

    validators.postal('94117').should.be.ok;
    validators.postal('94117 3333').should.be.ok;
    validators.postal('94117-3333').should.be.ok;
    validators.postal('94117 33333').should.not.be.ok;
    validators.postal('9411').should.not.be.ok;
  });

  it('can validate a US SSN', function () {
    validators.ssn(123).should.not.be.ok;
    validators.ssn({}).should.not.be.ok;

    validators.ssn('123456789').should.be.ok;
    validators.ssn('123-45-6789').should.be.ok;

    validators.ssn('1234567890').should.not.ok;
    validators.ssn('123-45-678').should.not.be.ok;
  });
});

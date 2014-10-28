/*global describe, it, xit, xdescribe, before, require */
/*jshint expr:true*/

var iz = require('../src/iz');
var validator = require('../src/validators');
describe('Validation', function () {
    'use strict';

    it('can validate alpha numeric values', function () {
        iz.alphaNumeric('a2d1kf0v9r9fje9fdgnsdksdf9240uyjsdfgkj').should.be.ok;
        iz.alphaNumeric('aaaaaaa').should.be.ok;
        iz.alphaNumeric('999999').should.be.ok;
        iz.alphaNumeric(9999999).should.be.ok;
        iz.alphaNumeric('_3423423').should.not.be.ok;
        iz.alphaNumeric('342 3423').should.not.be.ok;
        iz.alphaNumeric('alals*fd').should.not.be.ok;
        iz.alphaNumeric({}).should.not.be.ok;
        iz.alphaNumeric(function () {}).should.not.be.ok;
        iz.alphaNumeric([]).should.not.be.ok;

        iz.alphaNumeric(null).should.be.ok;
        iz.alphaNumeric(undefined).should.be.ok;
    });

    it('can validate string values', function () {
        iz.string('').should.be.ok;
        iz.string('a2d1kf0v9r9fje9fdgnsdksdf9240uyjsdfgkj').should.be.ok;
        iz.string('aaaaaaa').should.be.ok;
        iz.string('999999').should.be.ok;
        iz.string('_3423423').should.be.ok;
        iz.string('342 3423').should.be.ok;
        iz.string('alals*fd').should.be.ok;

        iz.string(new String('')).should.be.ok;
        iz.string(new String('239084203')).should.be.ok;
        iz.string(new String('alals*fd')).should.be.ok;

        iz.string(9999999).should.not.be.ok;
        iz.string({}).should.not.be.ok;
        iz.string([]).should.not.be.ok;
        iz.string(function () {}).should.not.be.ok;
        iz.string(/[ \-]/g).should.not.be.ok;
        iz.string(new Date()).should.not.be.ok;

        function Car() {}
        iz.string(new Car()).should.not.be.ok;

        iz.string(null).should.be.ok;
        iz.string(undefined).should.be.ok;
    });

    it('can validate that a primitive is between 2 other primitives', function () {
        iz.between(5, 5, 6).should.be.ok;
        iz.between(6, 5, 6).should.be.ok;
        iz.between(4, 3, 5).should.be.ok;
        iz.between(3, 4, 5).should.not.be.ok;
        iz.between(7, 4, 5).should.not.be.ok;
        iz.between('abc', 'aaa', 'bbb').should.be.ok;
        iz.between('aaa', 'abc', 'bbb').should.not.be.ok;
        iz.between('aaa', 'aaa', 'bbb').should.be.ok;
        iz.between([1, 2], [1], [1, 4]).should.not.be.ok; //default array comparison... this is false.
        iz.between({},{},{}).should.not.be.ok; //it hates objects
        iz.between(function (){}, function (){}, function () {}).should.not.be.ok; //it also despises functions

        iz.between(null, 1, 5).should.be.ok;
        iz.between(undefined, 1, 5).should.be.ok;
    });

    it('can validate boolean values', function () {
        iz.boolean(true).should.be.ok;
        iz.boolean(false).should.be.ok;
        iz.boolean(1).should.be.ok;
        iz.boolean(0).should.be.ok;
        iz.boolean(-1).should.not.be.ok;
        iz.boolean('deadbeef').should.not.be.ok;
        iz.boolean('*').should.not.be.ok;
        iz.boolean(/[ \-]/g).should.not.be.ok;

        iz.boolean(null).should.be.ok;
        iz.boolean(undefined).should.be.ok;
    });

    it('can validate blank values', function() {
        iz.blank('').should.be.ok;
        iz.blank('hi').should.not.be.ok;
        iz.blank([]).should.not.be.ok;

        iz.blank(undefined).should.be.ok;
        iz.blank(null).should.be.ok;
    });

    /**
     * Tests from Paypal: http://www.paypalobjects.com/en_US/vhelp/paypalmanager_help/credit_card_numbers.htm
     */
    it('can validate credit card numbers', function () {
        iz.cc('371449635398431').should.be.ok; //amex
        iz.cc('343434343434343').should.be.ok; //amex
        iz.cc('371144371144376').should.be.ok; //amex corp
        iz.cc('5610591081018250').should.be.ok; //aus bankcard
        iz.cc('30569309025904').should.be.ok; //diners club
        iz.cc('38520000023237').should.be.ok; //diners club
        iz.cc('6011111111111117').should.be.ok; //discover
        iz.cc('6011000990139424').should.be.ok; //discover
        iz.cc('3530111333300000').should.be.ok; //jcb
        iz.cc('3566002020360505').should.be.ok; //jcb
        iz.cc('5555555555554444').should.be.ok; //mc
        iz.cc('5105105105105100').should.be.ok; //mc
        iz.cc('4111111111111111').should.be.ok; //visa
        iz.cc('4012888888881881').should.be.ok; //visa
        iz.cc('4222222222222').should.be.ok; //visa
        //iz.cc('76009244561').should.be.ok; //dankort (pbs) currently fails... anyone know why?
        iz.cc('5019717010103742').should.be.ok; //dankort (pbs)
        iz.cc('6331101999990016').should.be.ok; //switch/solo (paymentech)

        iz.cc('0000000000000000').should.not.be.ok;

        iz.cc('4012 8888 8888 1881').should.be.ok; //visa with spaces
        iz.cc('4012-8888-8888-1881').should.be.ok; //visa with dashes
        iz.cc({}).should.not.be.ok;
        iz.cc(function () {}).should.not.be.ok;
        iz.cc(['5']).should.not.be.ok;

        iz.cc(null).should.be.ok;
        iz.cc(undefined).should.be.ok;
    });

    it('can validated dates', function () {
        iz.date(new Date()).should.be.ok;
        iz.date(0).should.be.ok; //assumed milliseconds from epoch
        iz.date('09/23/2012').should.be.ok;
        iz.date('09-23-2012 21:27:00').should.be.ok;
        iz.date('January 5th, 2012').should.not.be.ok;
        iz.date('Pizza').should.not.be.ok;
        iz.date({}).should.not.be.ok;
        iz.date(function () {}).should.not.be.ok;
        iz.date([]).should.not.be.ok;

        iz.date(null).should.be.ok;
        iz.date(undefined).should.be.ok;
    });

    it('can validate decimals', function () {
        iz.decimal('5.5').should.be.ok;
        iz.decimal(5.5).should.be.ok;
        iz.decimal('340298.3234234').should.be.ok;

        iz.decimal(5).should.not.be.ok;
        iz.decimal('5').should.not.be.ok;
        iz.decimal('5.5.5').should.not.be.ok;
        iz.decimal({}).should.not.be.ok;
        iz.decimal(function () {}).should.not.be.ok;
        iz.decimal([]).should.not.be.ok;

        iz.decimal(null).should.be.ok;
        iz.decimal(undefined).should.be.ok;
    });

    it('can validate email address', function () {
        iz.email('bob@bob').should.be.ok;
        iz.email('bob@bob.com').should.be.ok;
        iz.email('bob').should.not.be.ok;
        iz.email({}).should.not.be.ok;
        iz.email(function () {}).should.not.be.ok;
        iz.email([]).should.not.be.ok;
        iz.email(5).should.not.be.ok;

        iz.email(null).should.be.ok;
        iz.email(undefined).should.be.ok;
    });

    it('can validate that something is empty', function () {
        iz.empty([]).should.be.ok;
        iz.empty({}).should.be.ok;
        iz.empty(function () {}).should.be.ok;
        iz.empty(true).should.be.ok;
        iz.empty(5).should.be.ok;
        iz.empty({bob: true}).should.not.be.ok;
        iz.empty(['hi']).should.not.be.ok;

        iz.empty(null).should.be.ok;
        iz.empty(undefined).should.be.ok;
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
        iz.equal('bob', 'bob').should.be.ok;
        iz.equal({},{}).should.be.ok;
        iz.equal({},{'bob': true}).should.be.ok;
        iz.equal(obj1, obj2).should.be.ok;
        iz.equal(obj1, obj3).should.be.ok;
        iz.equal(obj1, obj4).should.not.be.ok;
    });

    it('can validate that an object is an extension of another object', function () {
        iz.extension({},'5').should.not.be.ok;
        iz.extension({
            bob: 10,
            something: 'hi',
            somethingElse: 'bye'
        },{
            bob: '912dfinn',
            something: 'yes!'
        }).should.be.ok;
        iz.extension([],[]).should.be.ok;
        iz.extension({
            bob: 10,
            something: 'hi'
        },{
            bob: '912dfinn',
            something: 'yes!',
            somethingElse: 'bye'
        }).should.not.be.ok;
        iz.extension([],['hello']).should.not.be.ok;
    });

    it('can validate that a file extension is valid', function () {
        iz.fileExtension('apple_pie.pizza', ['pizza']).should.be.ok;
        iz.fileExtension('hello.png', ['png']).should.be.ok;
        iz.fileExtension('hello.PNG', ['png']).should.be.ok;
        iz.fileExtension('hello.png', ['PNG']).should.not.be.ok;
        iz.fileExtension('hello.png', ['.png']).should.not.be.ok;
        iz.fileExtension('hello.mp3', ['png']).should.not.be.ok;
        iz.fileExtension({},{}).should.not.be.ok;

        iz.fileExtension(null).should.be.ok;
        iz.fileExtension(undefined).should.be.ok;
    });

    it('can validate audio file extensions', function () {
        iz.fileExtensionAudio('apple.mp3').should.be.ok;
        iz.fileExtensionAudio('apple.png').should.not.be.ok;

        iz.fileExtensionAudio(null).should.be.ok;
        iz.fileExtensionAudio(undefined).should.be.ok;
    });

    it('can validate image file extensions', function () {
        iz.fileExtensionImage('apple.png').should.be.ok;
        iz.fileExtensionImage('apple.mp3').should.not.be.ok;

        iz.fileExtensionImage(null).should.be.ok;
        iz.fileExtensionImage(undefined).should.be.ok;
    });

    it('can validate video file extensions', function () {
        iz.fileExtensionVideo('apple.mp4').should.be.ok;
        iz.fileExtensionVideo('apple.mp3').should.not.be.ok;

        iz.fileExtensionVideo(null).should.be.ok;
        iz.fileExtensionVideo(undefined).should.be.ok;
    });

    it('can tell if something is in an array', function () {
        iz.inArray('tofu', ['pizza','chicken','tofu','turkey']).should.be.ok;
        iz.inArray('lizard', ['pizza','chicken','tofu','turkey']).should.not.be.ok;
        iz.inArray(5,6).should.not.be.ok;
        iz.inArray({},[]).should.not.be.ok;
        iz.inArray(function () {}, 5).should.not.be.ok;
    });

    it('can detect an array', function () {
        iz.anArray(['pizza','chicken','tofu','turkey']).should.be.ok;
        iz.anArray('lizard').should.not.be.ok;
        iz.anArray(5).should.not.be.ok;
        iz.anArray({}).should.not.be.ok;
        iz.anArray(function () {}).should.not.be.ok;
        iz('').anArray().required().valid.should.not.be.ok;
    });

    it('can validate integers', function () {
        iz.int('1000').should.be.ok;
        iz.int(1000).should.be.ok;
        iz.int(999).should.be.ok;
        iz.int('11.0', true).should.be.ok;

        iz.int('11.0').should.not.be.ok;
        iz.int(11.2).should.not.be.ok;
        iz.int('bob').should.not.be.ok;
        iz.int({}).should.not.be.ok;
        iz.int([]).should.not.be.ok;
        iz.int(function () {}).should.not.be.ok;

        iz.int(null).should.be.ok;
        iz.int(undefined).should.be.ok;
    });

    it('can validate IPv4, IPv6 and host names', function () {
        iz.ip('pizza').should.be.ok;
        //ipv6
        iz.ip('3ffe:1900:4545:3:200:f8ff:fe21:67cf').should.be.ok;
        iz.ip('fe80:0:0:0:200:f8ff:fe21:67cf').should.be.ok;
        iz.ip('fe80::200:f8ff:fe21:67cf').should.be.ok;
        //ipv4
        iz.ip('0.0.0.0').should.be.ok;
        iz.ip('192.0.2.235').should.be.ok;
        //technically valid (citing wikipedia), but doesn't pass, but I don't think it is expected:
        iz.ip('0xC0.0x00.0x02.0xEB').should.not.be.ok;
        iz.ip('0300.0000.0002.0353').should.not.be.ok;
        iz.ip('0xC00002EB').should.not.be.ok;
        iz.ip('3221226219').should.not.be.ok;
        iz.ip('030000001353').should.not.be.ok;

        iz.ip(null).should.be.ok;
        iz.ip(undefined).should.be.ok;
    });

    it('can require a string to have some min length', function () {
        iz.minLength('Pizza', 5).should.be.ok;
        iz.minLength('pizza', 4).should.be.ok;
        iz.minLength('pizza', 6).should.not.be.ok;
        iz.minLength({}, 5).should.not.be.ok;
        iz.minLength('lizard', {}).should.not.be.ok;

        iz.minLength(null).should.be.ok;
        iz.minLength(undefined).should.be.ok;
    });

    it('can require an array to have some min length', function () {
        iz.minLength([1, 2, 3, 4, 5, 6], 6).should.be.ok;
        iz.minLength([1, 2, 3, 4, 5, 6], 5).should.be.ok;
        iz.minLength([1, 2, 3, 4, 5, 6], 7).should.not.be.ok;

        iz.minLength(null).should.be.ok;
        iz.minLength(undefined).should.be.ok;
    });

    it('can require a string to have some max length', function () {
        iz.maxLength('Pizza', 5).should.be.ok;
        iz.maxLength('pizza', 6).should.be.ok;
        iz.maxLength('pizza', 4).should.not.be.ok;
        iz.maxLength({}, 5).should.not.be.ok;
        iz.maxLength('lizard', {}).should.not.be.ok;

        iz.maxLength(null).should.be.ok;
        iz.maxLength(undefined).should.be.ok;
    });

    it('can require an array to have some max length', function () {
        iz.maxLength([1, 2, 3, 4, 5, 6], 6).should.be.ok;
        iz.maxLength([1, 2, 3, 4, 5, 6], 7).should.be.ok;
        iz.maxLength([1, 2, 3, 4, 5, 6], 5).should.not.be.ok;

        iz.maxLength(null).should.be.ok;
        iz.maxLength(undefined).should.be.ok;
    });

    it('can tell if a number is multiple of another number', function () {
        iz.multiple(10, 5).should.be.ok;
        iz.multiple(10, 2).should.be.ok;
        iz.multiple(2, 10).should.not.be.ok;
        iz.multiple(5, {}).should.not.be.ok; // disallow everything but numbers

        iz.multiple(null).should.be.ok;
        iz.multiple(undefined).should.be.ok;
    });

    it('can tell if something is a number', function () {
        iz.number({}).should.not.be.ok;
        iz.number('5').should.be.ok;
        iz.number('5.32342').should.be.ok;
        iz.number(23123).should.be.ok;
        iz.number('bob').should.not.be.ok;

        iz.number(null).should.be.ok;
        iz.number(undefined).should.be.ok;
    });

    it('can tell if the name of an object is equal to some string', function () {
        var obj = {};

        function Car() { }

        iz.ofType(new Car(), 'Car').should.be.ok;
        iz.ofType(new Car(), 'Object').should.not.be.ok;
        iz.ofType(obj, 'Object').should.be.ok;

        iz.ofType(null).should.be.ok;
        iz.ofType(undefined).should.be.ok;
    });

    it('can validate a north american phone number', function () {
        iz.phone(1231231).should.not.be.ok;
        iz.phone({}).should.not.be.ok;

        iz.phone('1-415-222-2222').should.be.ok;
        iz.phone('1.415.555.5555 extension 422').should.be.ok;
        iz.phone('1415.323.3242 extension x422').should.be.ok;
        iz.phone('11231234567').should.be.ok;

        iz.phone('123').should.not.be.ok;
        iz.phone('123456789012').should.not.be.ok;

        iz.phone('1234567890').should.be.ok;
        iz.phone('12345678901').should.be.ok;

        iz.phone(null).should.be.ok;
        iz.phone(undefined).should.be.ok;
    });

    it('can validate a US zip-code', function () {
        iz.postal(1231231).should.not.be.ok;
        iz.postal({}).should.not.be.ok;

        iz.postal('94117').should.be.ok;
        iz.postal('94117 3333').should.be.ok;
        iz.postal('94117-3333').should.be.ok;
        iz.postal('94117 33333').should.not.be.ok;
        iz.postal('9411').should.not.be.ok;

        iz.postal(null).should.be.ok;
        iz.postal(undefined).should.be.ok;
    });

    it('can validate a US SSN', function () {
        iz.ssn(123).should.not.be.ok;
        iz.ssn({}).should.not.be.ok;

        iz.ssn('123456789').should.be.ok;
        iz.ssn('123-45-6789').should.be.ok;

        iz.ssn('1234567890').should.not.ok;
        iz.ssn('123-45-678').should.not.be.ok;

        iz.ssn(null).should.be.ok;
        iz.ssn(undefined).should.be.ok;
    });

    it('can validate required', function() {
        iz.required(null).should.not.be.ok;
        iz.required(undefined).should.not.be.ok;
        iz.required('').should.not.be.ok;
        iz.required({}).should.be.ok;
        iz.required(function () {}).should.be.ok;
        iz.required([]).should.be.ok;
        iz.required(5).should.be.ok;
        iz.required(new Date()).should.be.ok;
    });

    var dummyValidator = function(value){
        if(typeof value !=='string'){
            return false;
        }
        return value.indexOf('test') === 0;
    };

    it('can add custom validator',function(){
        iz.addValidator('testStart',dummyValidator);

        validator.should.have.property('testStart');

        iz.should.have.property('testStart');
        iz.testStart('test text').should.be.ok;
    });

    it('custom validator does not override existing validator', function () {
        iz.addValidator.bind(null, 'ssn', dummyValidator).should.throw();
    });

    it('can override existing validator',function(){
        iz.addValidator('ssn', dummyValidator, true);

        validator.should.have.property('testStart');

        iz.should.have.property('ssn');
        iz.ssn('test text').should.be.ok;
    });

    it('customer validator does not override addValidator', function () {
        iz.addValidator.bind(null, 'addValidator', dummyValidator).should.throw();
    });
});

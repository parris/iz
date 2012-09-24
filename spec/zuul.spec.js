/*global describe, it, xit, xdescribe, before, require */
var zuul = require("../zuul");

describe("Zuul", function() {
    'use strict';

    it("Can validate alpha numeric values", function () {
        zuul.alphaNumeric("a2d1kf0v9r9fje9fdgnsdksdf9240uyjsdfgkj").should.be.ok;
        zuul.alphaNumeric("aaaaaaa").should.be.ok;
        zuul.alphaNumeric("999999").should.be.ok;
        zuul.alphaNumeric(9999999).should.be.ok;
        zuul.alphaNumeric("_3423423").should.not.be.ok;
        zuul.alphaNumeric("342 3423").should.not.be.ok;
        zuul.alphaNumeric("alals*fd").should.not.be.ok;
    });

    it("Can validate that a primitive is between 2 other primitives", function () {
        zuul.between(5, 5, 6).should.be.ok;
        zuul.between(6, 5, 6).should.be.ok;
        zuul.between(4, 3, 5).should.be.ok;
        zuul.between(3, 4, 5).should.not.be.ok;
        zuul.between(7, 4, 5).should.not.be.ok;
        zuul.between("abc", "aaa", "bbb").should.be.ok;
        zuul.between("aaa", "abc", "bbb").should.not.be.ok;
        zuul.between("aaa", "aaa", "bbb").should.be.ok;
        zuul.between([1, 2], [1], [1, 4]).should.not.be.ok; //default array comparison... this is false.
        zuul.between({},{},{}).should.not.be.ok; //it hates objects
        zuul.between(function (){}, function (){}, function () {}).should.not.be.ok; //it also despises functions
    });

    it("Can validate boolean values", function () {
        zuul.boolean(true).should.be.ok;
        zuul.boolean(false).should.be.ok;
        zuul.boolean(1).should.be.ok;
        zuul.boolean(0).should.be.ok;
        zuul.boolean(-1).should.not.be.ok;
        zuul.boolean("deadbeef").should.not.be.ok;
        zuul.boolean("*").should.not.be.ok;
        zuul.boolean(/[ -]/g).should.not.be.ok
    });

    /**
     * Tests from Paypal: http://www.paypalobjects.com/en_US/vhelp/paypalmanager_help/credit_card_numbers.htm
     */
    it("Can validate credit card numbers", function () {
        zuul.cc("371449635398431").should.be.ok; //amex
        zuul.cc("343434343434343").should.be.ok; //amex
        zuul.cc("371144371144376").should.be.ok; //amex corp
        zuul.cc("5610591081018250").should.be.ok; //aus bankcard
        zuul.cc("30569309025904").should.be.ok; //diners club
        zuul.cc("38520000023237").should.be.ok; //diners club
        zuul.cc("6011111111111117").should.be.ok; //discover
        zuul.cc("6011000990139424").should.be.ok; //discover
        zuul.cc("3530111333300000").should.be.ok; //jcb
        zuul.cc("3566002020360505").should.be.ok; //jcb
        zuul.cc("5555555555554444").should.be.ok; //mc
        zuul.cc("5105105105105100").should.be.ok; //mc
        zuul.cc("4111111111111111").should.be.ok; //visa
        zuul.cc("4012888888881881").should.be.ok; //visa
        zuul.cc("4222222222222").should.be.ok; //visa
        //zuul.cc("76009244561").should.be.ok; //dankort (pbs) currently fails... anyone know why?
        zuul.cc("5019717010103742").should.be.ok; //dankort (pbs)
        zuul.cc("6331101999990016").should.be.ok; //switch/solo (paymentech)

        zuul.cc("0000000000000000").should.not.be.ok;

        zuul.cc("4012 8888 8888 1881").should.be.ok; //visa with spaces
        zuul.cc("4012-8888-8888-1881").should.be.ok; //visa with dashes
    });

    xit("Can validate integers", function () {
        zuul.int(intTestPassString1).should.be.ok;
    });
});

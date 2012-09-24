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
        zuul.alphaNumeric({}).should.not.be.ok;
        zuul.alphaNumeric(function () {}).should.not.be.ok;
        zuul.alphaNumeric([]).should.not.be.ok;
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
        zuul.cc({}).should.not.be.ok;
        zuul.cc(function () {}).should.not.be.ok;
        zuul.cc(["5"]).should.not.be.ok;
    });

    it("Can validated dates", function () {
        zuul.date(new Date()).should.be.ok;
        zuul.date(0).should.be.ok; //assumed milliseconds from epoch
        zuul.date("09/23/2012").should.be.ok;
        zuul.date("09-23-2012 21:27:00").should.be.ok;
        zuul.date("January 5th, 2012").should.not.be.ok;
        zuul.date("Pizza").should.not.be.ok;
        zuul.date({}).should.not.be.ok;
        zuul.date(function () {}).should.not.be.ok;
        zuul.date([]).should.not.be.ok;
    });

    it("Can validate decimals", function () {
        zuul.decimal("5.5").should.be.ok;
        zuul.decimal(5.5).should.be.ok;
        zuul.decimal("340298.3234234").should.be.ok;

        zuul.decimal(5).should.not.be.ok;
        zuul.decimal("5").should.not.be.ok;
        zuul.decimal("5.5.5").should.not.be.ok;
        zuul.decimal({}).should.not.be.ok;
        zuul.decimal(function () {}).should.not.be.ok;
        zuul.decimal([]).should.not.be.ok;
    });

    it("Can validate email address", function () {
        zuul.email("bob@bob").should.be.ok;
        zuul.email("bob@bob.com").should.be.ok;
        zuul.email("bob").should.not.be.ok;
        zuul.email({}).should.not.be.ok;
        zuul.email(function () {}).should.not.be.ok;
        zuul.email([]).should.not.be.ok;
        zuul.email(5).should.not.be.ok;
    });

    it("Can validate that an object is an extension of another object", function () {
        zuul.extension({},"5").should.not.be.ok;
        zuul.extension({
            bob: 10,
            something: "hi",
            somethingElse: "bye"
        },{
            bob: "912dfinn",
            something: "yes!"
        }).should.be.ok;
        zuul.extension([],[]).should.be.ok;
        zuul.extension({
            bob: 10,
            something: "hi"
        },{
            bob: "912dfinn",
            something: "yes!",
            somethingElse: "bye"
        }).should.not.be.ok;
        zuul.extension([],["hello"]).should.not.be.ok;
    });

    it("Can validate that a file extension is valid", function () {
        zuul.fileExtension(["pizza"],"apple_pie.pizza").should.be.ok;
        zuul.fileExtension(["png"],"hello.png").should.be.ok;
        zuul.fileExtension(["png"],"hello.PNG").should.be.ok;
        zuul.fileExtension([], "").should.not.be.ok;
        zuul.fileExtension("","").should.not.be.ok;
        zuul.fileExtension(["PNG"],"hello.png").should.not.be.ok;
        zuul.fileExtension([".png"],"hello.png").should.not.be.ok;
        zuul.fileExtension(["png"],"hello.mp3").should.not.be.ok;
        zuul.fileExtension({},{}).should.not.be.ok;
    });

    it("Can validate audio file extensions", function () {
        zuul.fileExtensionAudio("apple.mp3").should.be.ok;
        zuul.fileExtensionAudio("apple.png").should.not.be.ok;
    });

    it("Can validate image file extensions", function () {
        zuul.fileExtensionImage("apple.png").should.be.ok;
        zuul.fileExtensionImage("apple.mp3").should.not.be.ok;
    });

    it("Can validate video file extensions", function () {
        zuul.fileExtensionVideo("apple.mp4").should.be.ok;
        zuul.fileExtensionVideo("apple.mp3").should.not.be.ok;
    });

    it("Can tell if something is in an array", function () {
        zuul.inArray(["pizza","chicken","tofu","turkey"], "tofu").should.be.ok;
        zuul.inArray(["pizza","chicken","tofu","turkey"], "lizard").should.not.be.ok;
        zuul.inArray(5,6).should.not.be.ok;
        zuul.inArray({},[]).should.not.be.ok;
        zuul.inArray(function () {}, 5).should.not.be.ok;
    });

    xit("Can validate integers", function () {
        zuul.int(intTestPassString1).should.be.ok;
    });
});

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

    xit("Can validate integers", function () {
        zuul.int(intTestPassString1).should.be.ok;
    });
});

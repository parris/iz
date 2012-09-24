/*global describe, it, xit, xdescribe, before */
var Validation = require("../validation");

describe("Validation", function() {
    'use strict';
    var intTestPassString1 = "99999",
        intTestFailString1 = "3409a",
        intTestFailString2 = "deadbeaf",
        intTestFailString3 = "11.0030",
        intTestPassString2 = "11.0";



    it("Can validate integers", function () {
        Validation.isInteger(intTestPassString1).should.be.ok;
    });
});

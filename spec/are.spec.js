/*global describe, it, xit, xdescribe, before, require */
/*jshint expr:true*/

var iz = require("../iz"),
    are = require("../are");

describe("are", function() {
    'use strict';

    beforeEach(function() {
        this.costErrors = {
            decimal: "Must be a decimal!"
        };
        this.ageErrors = {
            not_decimal: "Shouldn't be a decimal!",
            int: "Must be an integer",
            between: "This movie is rated R, you are too young!"
        };
        this.rules = {
            cost: iz(5.00, this.costErrors).decimal(),
            age: iz(20, this.ageErrors)
                .not().decimal()
                .int().between(17, 10000)
        };
    });

    it("allows you to validate multiple things at once", function () {
        are(this.rules).valid().should.not.be.ok;
    });
});

/*global describe, it, xit, xdescribe, before, require */
/*jshint expr:true*/

var iz = require('../src/iz');
describe('Iz', function () {
    'use strict';

    it('can be created', function () {
        //some value
        (typeof (iz(5)) === 'object').should.be.ok;
        (typeof iz === 'function').should.be.ok;
    });

    it('has prototyped methods and can call one', function () {
        (typeof iz(5).alphaNumeric === 'function').should.be.ok;
        (iz(5).alphaNumeric().valid).should.be.ok;
        //with parameters
        (iz(5).between(3, 5).valid).should.be.ok;
    });

    it('allows methods to be chained together', function () {
        iz(5).alphaNumeric().between(3, 5).int().valid.should.be.ok;
    });

    it('tells you what fails when you chain', function () {
        var result = iz(5).between(1, 2).boolean();
        result.valid.should.not.be.ok;
        result.errors.should.include('between');
        result.errors.should.include('boolean');
    });

    it('accepts an error message list', function () {
        var errors = {
                between: 'Is not between',
                boolean: 'Is not Boolean'
            },
            result = iz(5, errors).between(1, 2).boolean();
        result.valid.should.not.be.ok;
        result.errors.should.include(errors.between);
        result.errors.should.include(errors.boolean);
    });

    it('allows to .not validations', function () {
        iz(5).not().between(10, 20).valid.should.be.ok;
        iz(5).not().email().valid.should.be.ok;
        iz('bob@yahoo').not().email().valid.should.not.be.ok;
    });

    it('accepts errors for .not\'d validations', function () {
        var expected = 'Your value needs to not be between 4 and 6, it is currently 5!',
            error_messages = {
                not_between: 'Your value needs to not be between {{ 1 }} and {{2 }}, it is currently {{0}}!'
            };

        iz(5, error_messages).not().between(4, 6).errors.should.include(expected);
        iz(5).not().between(4, 6).errors.should.include('Not between');
    });

    it('allows switching between .not and normal validations', function () {
        iz(5).between(4, 6).not().ip().int().valid.should.be.ok;
    });

    it('allows for revalidation when the value is changed', function() {
        var rule = iz(5).between(2, 8);
        rule.valid.should.be.ok;
        rule.value = 10;
        rule.revalidate().valid.should.not.be.ok;
    });

    it('calls revalidate when setting a new value', function() {
        var rule = iz(5).between(2, 8);
        rule.setValue(10).valid.should.not.be.ok;
    });

    it('clears out errors and status during revalidation', function() {
        var rule = iz(5).between(6, 8);
        rule.valid.should.not.be.ok;
        rule.errors.length.should.equal(1);
        rule.setValue(7).valid.should.be.ok;
        rule.errors.length.should.equal(0);
    });
});

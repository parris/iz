/*global describe, it, xit, xdescribe, before, require */
/*jshint expr:true*/

var iz = require('../src/iz'),
    are = require('../src/are');

describe('Are', function() {
    'use strict';

    describe('group validations', function() {

        beforeEach(function() {
            this.costErrors = {
                decimal: 'Must be a decimal!'
            };
            this.ageErrors = {
                not_decimal: 'Shouldn\'t be a decimal!',
                int: 'Must be an integer',
                between: 'This movie is rated R, you are too young!'
            };
            this.rules = {
                cost: iz(5.00, this.costErrors).number(),
                age: iz(20, this.ageErrors)
                    .not().decimal()
                    .int().between(17, 10000)
            };
        });

        it('allows you to validate multiple things at once', function () {
            are(this.rules).valid().should.be.ok;
        });

    });

    describe('JSON group validations', function() {

        beforeEach(function() {
            this.rules = {
                'cost': [
                    {
                        'rule': 'between',
                        'args': [17, 1000],
                        'error': 'The cost must be between 17, 1000'
                    },
                    {
                        'rule': 'decimal',
                        'error': 'The cost must be a decimal'
                    },
                    {
                        'rule': 'required',
                        'error': 'You must specify a cost'
                    },
                ],
                'producer.id': [
                    {
                        'rule': 'int',
                        'error': 'Producer ID must be an int'
                    }
                ],
                'producer.name.first': [
                    {
                        'rule': 'alphaNumeric',
                        'error': 'Must be names and numbers'
                    }
                ]
            };

            this.validObject = {
                cost: 90.3,
                producer: {
                    id: 5,
                    name: {
                        first: 'steve'
                    }
                }
            };

            this.invalidObject = {
                cost: 90.3,
                producer: {
                    id: 'bob', //invalid
                    name: {
                        first: 'steve'
                    }
                }
            };
        });

        it('correctly validates', function() {
            are(this.rules).validFor(this.validObject).should.be.ok;
            are(this.rules).validFor(this.invalidObject).should.not.be.ok;
        });

        it('returns error messages', function() {
            var myAre = are(this.rules),
                errorFields;

            myAre.validFor(this.invalidObject);
            errorFields = myAre.getInvalidFields();

            errorFields['producer.id'].length.should.be.ok;
        });

        describe('with required fields', function() {

            beforeEach(function() {
                this.rules['producer.name.first'].push({
                    rule: 'required'
                });

                this.validObject = {
                    cost: 40.3,
                    producer: {
                        name: {
                            first: 'steve'
                        }
                    }
                };

                this.invalidObject = {
                    producer: {}
                };

                this.validations = are(this.rules);
            });

            it('correctly validates', function() {
                this.validations.validFor(this.validObject).should.be.ok;
                this.validations.validFor(this.invalidObject).should.not.be.ok;
            });

        });

    });

});

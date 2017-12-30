/*global describe, it, xit, xdescribe, before, require */
/*jshint expr:true*/

const are = require('../src/are');

describe('Are', function() {
  'use strict';

  describe('json validations', function() {

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
      are(this.rules).for(this.validObject).valid.should.be.ok;
      are(this.rules).for(this.invalidObject).valid.should.not.be.ok;
    });

    it('returns error messages', function() {
      const result = are(this.rules).for(this.invalidObject);
      const invalidFields = result.invalidFields;
      invalidFields['producer.id'].length.should.eql(1);
      invalidFields['producer.id'][0].should.eql('Producer ID must be an int');
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

        this.invalidObject2 = {
          producer: {
            name: {
              first: '',
            }
          }
        };

        this.validations = are(this.rules);
      });

      it('correctly validates', function() {
        this.validations.for(this.validObject).valid.should.be.ok;
        this.validations.for(this.invalidObject).valid.should.not.be.ok;
        this.validations.for(this.invalidObject2).valid.should.not.be.ok;
      });

      it('correctly validates (simple)', function() {
        const rules = {
          name: [
            {
              rule: 'required',
              error: 'You must specify a name',
            },
          ],
        };

        are(rules).for({ name: '' }).valid.should.not.be.ok;
      });

    });
  });

  describe('validation passes for Are rules', function() {
    it('correctly validates', async function() {
      this.rules = {
        theDate: [
          {
            'rule': 'date',
            'error': 'It is not a date!'
          },
        ],
      };

      this.obj = { theDate: '09/23/2012' };
      const result = are(this.rules).for(this.obj);
      result.valid.should.eql(true);
    });
  });

  describe('async validation', function() {
    it('correctly validates', async function() {
      this.rules = {
        cost: [
          { rule: 'sleepyFalse' },
          { rule: 'required' },
        ],
      };

      this.obj = { cost: 40.3 };
      const result = await are(this.rules).for(this.obj).async;
      result.valid.should.eql(false);
    });
  });

});

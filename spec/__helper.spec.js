process.env.NODE_ENV = 'test';

global.should = require('should');

const iz = require('../src/iz');
iz.register(require('../src/validators'));

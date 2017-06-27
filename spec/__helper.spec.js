process.env.NODE_ENV = 'test';

global.should = require('should');

const iz = require('../lib/iz');
iz.register(require('../lib/validators'));
iz.register({
  sleepyTrue: function sleepyTrue() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 10);
    });
  },
  sleepyFalse: function sleepyFalse() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, 10);
    });
  },
  sleepyFalseReject: function sleepyFalseReject() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(false);
      }, 10);
    });
  },
});

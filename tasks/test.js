module.exports = function (grunt) {
    'use strict';

    grunt.config.set('simplemocha', {
        options: {
          globals: ['should'],
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        },

        all: { src: 'spec/**/*.js' }
    });

};

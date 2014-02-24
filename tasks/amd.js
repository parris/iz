module.exports = function (grunt) {
    'use strict';

    grunt.config.set('requirejs.iz', {
        options: {
            appDir: 'src/',
            dir: 'amd/',
            cjsTranslate: true,
            optimize: 'none'
        }
    });

};

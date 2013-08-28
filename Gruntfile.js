/*global module */

module.exports = function(grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json'),
        bannerTemplate =
            '/*!\n' +
            ' * ' + pkg.name + ' - v' + pkg.version + ' ' + pkg.homepage + '\n' +
            ' * Built: ' + grunt.template.today('yyyy-mm-dd') + '\n' +
            ' * Copyright (c) ' + grunt.template.today('yyyy-mm-dd') + ' ' + pkg.author + '\n' +
            ' * Licensed under the ' + pkg.license + ' license\n' +
            ' */\n',
        requirejs = require('requirejs');

    grunt.initConfig({
        pkg: pkg,
        simplemocha: {
            options: {
              globals: ['should'],
              timeout: 3000,
              ignoreLeaks: false,
              ui: 'bdd',
              reporter: 'spec'
            },

            all: { src: 'spec/**/*.js' }
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('requirejs', function() {
        requirejs.optimize({
            baseUrl: 'src/',
            out: 'dist/iz.js',
            include: ['are', 'validators', 'iz'],
            cjsTranslate: true,
            optimize: 'uglify2',
            wrap: {
                start: bannerTemplate,
                end: ''
            }
        });
    });

    grunt.registerTask('build', ['requirejs']);
    grunt.registerTask('test', ['simplemocha']);

    grunt.registerTask('default', ['test', 'build']);
};

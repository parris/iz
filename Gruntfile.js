/*global module */

module.exports = function(grunt) {
    'use strict';

    var bannerTemplate =
        '/*!\n' +
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> <%= pkg.homepage %>\n' +
        ' * Built: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
        ' * Licensed under the <%= pkg.license %> license\n' +
        ' */\n',
        pkg = grunt.file.readJSON('package.json'),
        one = require('one');

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
        },
        uglify: {
            iz: {
                options: {
                    banner: bannerTemplate,
                    beautify: true,
                    width: 100,
                    mangle: false,
                    compress: false
                },
                files: {
                    //reading from browserify bundle
                    'dist/iz.js': ['dist/iz.js']
                }
            },
            izMin: {
                options: {
                    banner: bannerTemplate,
                    compress: true,
                    mangle: {
                        except: ['Iz']
                    }
                },
                files: {
                    'dist/iz.min.js': ['dist/iz.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('one', function() {
        one('./src/web.js').save('./dist/iz.js');
    });

    grunt.registerTask('build', ['one', 'uglify']);
    grunt.registerTask('test', ['simplemocha']);

    grunt.registerTask('default', ['test', 'build']);
};

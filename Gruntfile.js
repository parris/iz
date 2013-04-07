module.exports = function(grunt) {

    var bannerTemplate =
        '/*!\n' +
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> <%= pkg.homepage %>\n' +
        ' * Built: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
        ' * Licensed under the <%= pkg.license %> license\n' +
        ' */\n',
        pkg = grunt.file.readJSON('package.json');

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
        shell: {
            one: {
                command: './node_modules/one/bin/onejs build webpackage.json'
            }
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
                    compress: false,
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

    grunt.registerTask('build', ['shell', 'uglify']);
    grunt.registerTask('test', ['simplemocha']);

    grunt.registerTask('default', ['test', 'build']);
};

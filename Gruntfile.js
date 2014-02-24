/*global module */

module.exports = function(grunt) {
    'use strict';

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('build', ['requirejs']);
    grunt.registerTask('test', ['simplemocha']);
    grunt.registerTask('default', ['test', 'build']);
};

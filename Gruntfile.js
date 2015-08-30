/*jslint node: true, indent: 2 */
'use strict';
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg     : grunt.file.readJSON('package.json'),
    jshint  : {
      all     : ['package.json', 'Gruntfile.js', 'index.js', 'routes/**/*.js', 'common/**/*.js', 'tests/**/*.js']
    },
    jasmine_nodejs : {
      options : {
        specNameSuffix: 'spec.js'
      },
      all     : {
        specs : [
          "test/*.spec.js"
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  // Default task(s).
  grunt.registerTask('default', [
    'jshint',
    'jasmine_nodejs'
  ]);

};


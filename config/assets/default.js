/**
* Created by Quyen Nguyen Huu
* Email: nghuuquyen@gmail.com
*/

'use strict';

module.exports = {
  client: {
    lib: {
      css: [],
      js: [],
      tests: []
    },
    css: [
      'client/modules/*/css/*.css',
      'client/modules/*/css/**/*.css'
    ],
    sass: [
      'client/modules/*/scss/*.scss',
      'client/modules/*/scss/**/*.scss'
    ],
    js: [
      'client/modules/core/app/config.js',
      'client/modules/core/app/init.js',
      'client/modules/*/*.js',
      'client/modules/*/**/*.js'
    ],
    views: ['client/modules/*/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'Gruntfile.js',
    allJS: ['server.js', 'config/**/*.js', 'app/**/*.js'],
    views: 'app/views/*.html'
  }
};

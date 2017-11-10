module.exports = function (grunt) {
    grunt.registerTask('run-production', ["env:production", 'build-production' , 'concurrent:build']);
};

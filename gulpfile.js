var gulp = require('gulp');
var browserSync = require('browser-sync');

// Watch Files For Changes & Reload
gulp.task('serve', function () {
  browserSync({
    notify: false,
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function (snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['.tmp', '.'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

});
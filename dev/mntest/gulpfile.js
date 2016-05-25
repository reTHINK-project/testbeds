var fs = require('fs');
var gulp = require('gulp');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var shell = require('gulp-shell');
var colors = require('colors/safe');

// Task and dependencies to distribute for all environments;
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('buildMatrix', function() {

  var stubBundler = browserify('./src/stub/MatrixProtoStub.js',
  {
    standalone: 'Stub',
    debug: false
  }).transform(babel,{
    presets: ['es2015']
  });

  function rebundle() {
    stubBundler.bundle()
      .on('error', function(err) {
        console.error(err);
        this.emit('end');
      })
      .pipe(fs.createWriteStream("./test/stub/Stub.js"));
  }

  rebundle();
});

gulp.task('testmatrix', [], shell.task([
  'karma start matrix.conf.js'
]));

gulp.task('testvertx', [], shell.task([
  'karma start vertx.conf.js'
]));

gulp.task('testnodejs', [], shell.task([
  'karma start nodejs.conf.js'
]));

gulp.task('help', function() {
  console.log('\nThe following gulp tasks are available:\n');
  console.log('gulp' + ' ' + 'help\t\t\t' + '# show this help');
  console.log('gulp' + ' ' + 'test\t\t\t' + '# executes the test cases');
})

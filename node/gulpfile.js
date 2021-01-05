
  const gulp  = require('gulp');
  const proxy = require('marklogic/lib/proxy-generator.js');
  
  function defaultTask(cb) {
    // place code for your default task here
    cb();
  }

function proxygen() {
  return gulp.src('../src/main/ml-modules/root/ds/*')
      .pipe(proxy.generate())
      .pipe(gulp.dest('lib/'));
}
exports.proxygen = proxygen;
exports.default = defaultTask
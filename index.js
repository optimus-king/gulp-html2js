var es = require('event-stream')
var through = require('through')
var gutil = require('gulp-util')
var compile = require('./lib/compile')

module.exports = function(options) {
  options = options || {}
  options.base= options.base || 'src'
  options.quoteChar= options.quoteChar || '"'
  options.indentString= options.indentString || '  '
  options.target= options.target || 'js'
  options.htmlmin= options.htmlmin || {}
  options.useStrict= options.useStrict || false

  //Returns a map of files
  //We are changing this to do a map reduce of the files to a single module
  return es.map(function(file, cb) {
    compile(file, options, function(err, data) {
      if (err) return cb(err)

      file.contents = new Buffer(data)

      cb(null, file)
    })
  })
    .pipe(through(function write(data) {
        this.emit('data', data)
    }, function end() {
        this.emit('end')
    })
}

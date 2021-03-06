'use strict';

var gulp = require('gulp');
var realFavicon = require('../');
var assert = require('assert');
var path = require('path');
var fs = require("fs");
var Vinyl = require('vinyl')

function createFile(fileName) {
  var file = new Vinyl({
    path: path.join(__dirname, 'fixtures', fileName),
    cwd: path.join(__dirname),
    base: path.join(__dirname, 'fixtures'),
    contents: fs.createReadStream(path.join(__dirname, 'fixtures', fileName))
  });
}

describe('injectFaviconMarkups', function() {
  beforeEach(function() {
    if (! fs.existsSync(path.join(__dirname, 'output'))) {
      fs.mkdirSync(path.join(__dirname, 'output'));
    }
  });

  afterEach(function() {
    var rimraf = require('rimraf');
    rimraf.sync(path.join(__dirname, 'output'));
  });

  it('should inject favicon markups in a single file', function(done) {
    var markups = [
      '<link rel="icon" type="image/png" href="favicons/favicon-192x192.png" sizes="192x192">',
      '<link rel="icon" type="image/png" href="favicons/favicon-160x160.png" sizes="160x160">'
    ];

    var stream = gulp.src(path.join(__dirname, 'fixtures', 'test_1.html'))
      .pipe(realFavicon.injectFaviconMarkups(markups))
      .pipe(gulp.dest(path.join(__dirname, 'output')));
    stream.on('finish', function() {
      assert.equal(
        fs.readFileSync(path.join(__dirname, 'output', 'test_1.html'), 'utf8'),
        fs.readFileSync(path.join(__dirname, 'fixtures', 'test_1_expected_output.html'), 'utf8'));
      done();
    });
  });

  it('should inject favicon markups in several files', function(done) {
    var markups = [
      '<link rel="icon" type="image/png" href="favicons/favicon-192x192.png" sizes="192x192">',
      '<link rel="icon" type="image/png" href="favicons/favicon-160x160.png" sizes="160x160">'
    ];

    var stream = gulp.src([path.join(__dirname, 'fixtures', 'test_1.html'), path.join(__dirname, 'fixtures', 'test_2.html')])
      .pipe(realFavicon.injectFaviconMarkups(markups))
      .pipe(gulp.dest(path.join(__dirname, 'output')));
    stream.on('finish', function() {
      assert.equal(
        fs.readFileSync(path.join(__dirname, 'output', 'test_1.html'), 'utf8'),
        fs.readFileSync(path.join(__dirname, 'fixtures', 'test_1_expected_output.html'), 'utf8'));
      assert.equal(
        fs.readFileSync(path.join(__dirname, 'output', 'test_2.html'), 'utf8'),
        fs.readFileSync(path.join(__dirname, 'fixtures', 'test_2_expected_output.html'), 'utf8'));
      done();
    });
  });
});

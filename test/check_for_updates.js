'use strict';

var gulp = require('gulp');
var realFavicon = require('../');
var assert = require('assert');
var gutil = require('gulp-util');

describe('checkForUpdates', function() {
  it('should return an error when a new version is available', function(done) {
    realFavicon.checkForUpdates(0.9, function(err) {
      assert.notEqual(err, undefined);
      done();
    });
  });

  it('should return no error when no new version is available', function(done) {
    realFavicon.checkForUpdates(0.11, function(err) {
      assert.equal(err, undefined);
      done();
    });
  });
});

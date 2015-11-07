'use strict';

var rfg = require('rfg-api').init();
var gutil = require('gulp-util');
var fs = require('fs');
var through = require('through2');

var API_KEY = 'eabf77c98d6bd1eea81fb58be7895c42dafc2b21';
var PLUGIN_NAME = 'gulp-real-favicon';

module.exports = {
  generateFavicon: function(params, callback) {
    var request = rfg.createRequest({
      apiKey: API_KEY,
      masterPicture: params.masterPicture,
      iconsPath: params.iconsPath,
      design: params.design,
      settings: params.settings,
      versioning: params.versioning
    });

    rfg.generateFavicon(request, params.dest, function(err, data) {
      if (err) {
        throw new gutil.PluginError({
          plugin: PLUGIN_NAME,
          message: err
        });
      }

      fs.writeFileSync(params.markupFile, data.favicon.html_code);

      if (callback !== undefined) {
        callback(err);
      }
    });
  },

  injectFaviconMarkups: function(htmlMarkups) {
    var stream = through.obj(function(file, enc, cb) {
      if (file.isBuffer()) {
        rfg.injectFaviconMarkups(file.contents, htmlMarkups, {}, function(err, html) {
          file.contents = new Buffer(html);
          stream.push(file);
          cb();
        });
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Stream not supported'));
      }
    });

    // returning the file stream
    return stream;
  }
}

var Cache = require('./lib/cache');
var Defer = require('./lib/defer');

var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var request = require('request');

function ImageSpider(options) {
    options = options || {};
    this.maxSockets = options.maxSockets || 2;
    this.defer = new Defer({
        MAX_CONNECTIONS: this.maxSockets,
        callbackContext: this
    });
}

ImageSpider.prototype.add = function (urls) {
    this.defer.push(urls);
    // execute pop when add.
    this.defer.pop(this.start);
};

ImageSpider.prototype.start = function (url) {
    var dirs = url.replace(/^https?:\/\//, '')
                  .split('/');

    var filename = dirs.pop();
    dirs = './images/' + dirs.join('/') + '/';

    if (!fs.existsSync(dirs)) {
        mkdirp.sync(dirs);
    }

    var self = this;

    if (Cache.get(url)) {
        self.defer.resetIndex();
        self.defer.pop(self.start);
        return;
    }

    console.log('[Get img]', url);

    // cache the url.
    // important!!! before request.get
    Cache.set(url);

    request.get(url)
    .on('end', function () {
        self.defer.resetIndex();
        self.defer.pop(self.start);
    })
    .pipe(fs.createWriteStream(dirs + filename));
};

module.exports = ImageSpider;

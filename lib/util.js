var http = require('http');
var extend = require('node.extend');

var reUrl = /^https?:\/\//;

var ignoreUrls = ['xml'];
var canStoreType = ['js', 'css', 'png', 'gif', 'bmp', 'jpg', 'jpeg', '.ico'];

/**
 * @desc http.get
 * @param {string} url source url
 * @param {Object} options options config
 * @param {Function} callback callback function
 */
function get(url, callback) {
    var options = {
        autoRedict: true
    };

    http.get(url, function (res) {
        if (res.statusCode >= 300 && res.statusCode < 400
            && res.headers.location) {
            if (options.autoRedict) {
                get(res.headers.location, callback);
            }
        }
        else {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                callback(data);
            });
        }
    });
}

/**
 * @desc get the store filename from url
 * @param {string} url url string
 * @return {string} Boolean/filename
 */
function getFileNameFromUrl(url) {
    return reUrl.test(url)
           && url.replace(/\?.*/, '')
                 .replace(/\/$/, '')
                 .substring(url.lastIndexOf('/') + 1);
}

function getFileType(url) {
    var filename = getFileNameFromUrl(url);
    var match = filename.match(/\.(\w+)/);

    return !!match && match[1];
}

function isIgnoreUrl(url) {
    var type = getFileType(url);
    return ignoreUrls.indexOf(type) !== -1;
}

module.exports = {
    get: get,
    getFileType: getFileType,
    getFileNameFromUrl: getFileNameFromUrl,

    isIgnoreUrl: isIgnoreUrl,

    canStoreType: canStoreType
}

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var proto = Object.prototype;

var logDir = path.join(__dirname, '../', './log');

function isObject(obj) {
    return proto.toString(null, obj) === '[object Object]';
}

function notice(msg) {
    var logArr = [];
    if (isObject(msg)) {
        for (var item in msg) {
            logArr.push(item + '[' + msg[item] + ']');
        }
    }
    else if (typeof msg === 'string') {
        logArr.push(msg);
    }

    write('notice_log', logArr.join('\t'));
}

function write(file, str) {
    var dir = path.dirname(file);

    if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
    }

    fs.appendFileSync(path.join(logDir, file), (new Date()).toJSON().replace(/\.\d+Z$/, '') + '\t' + str + '\n');
}

function error(str) {
    write('error_log', str);
}

module.exports = {
    notice: notice,
    error: error
}
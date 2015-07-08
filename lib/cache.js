function URICache() {
    this.cache = {};
}

URICache.prototype.set = function (key) {
    this.cache[key] = true;
};

URICache.prototype.get = function (key) {
    return !!this.cache[key];
};

URICache.prototype.remove = function (key) {
    var self = this;
    if (key instanceof Array) {
        key.forEach(function (k, index) {
            self.remove(k);
        });
    }
    else {
        this.cache[key] = false;
    }
}

module.exports = new URICache();

/*
var cache = new URICache();
cache.set('http://www.baidu.com/');
cache.set('http://www.baidu.com/123');
cache.set('http://www.baidu.com/1234');

console.log(cache.get('http://www.baidu.com/'));

cache.remove(['http://www.baidu.com/', 'http://www.baidu.com/123']);

console.log(cache.get('http://www.baidu.com/'));
*/

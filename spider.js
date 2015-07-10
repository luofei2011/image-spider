var Util = require('./lib/util');
var Defer = require('./lib/defer');
var Url = require('./lib/url');
var Cache = require('./lib/cache');
var Log = require('./lib/log');

var chromeUA = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36';

var reHref = /href\s*=\s*((?:"[^"]*")|(?:'[^']*')|[^>\s]+)/g
var reImg = /<img((?:\s*[\w:\.-]+(?:\s*(?:(?:=))\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/g;

var MAX_LEVEL = 4;

function Spider(url, options) {
    options = options || {};
    this.url = url;
    this.userAgent = options.userAgent || chromeUA;
    this.maxSockets = options.maxSockets || 1;
    // 只抓取和初始化链接同域的地址
    this.onlyHost = true;
    this.defer = new Defer({
        MAX_CONNECTIONS: this.maxSockets,
        spider: this
    });
}

Spider.prototype.crawl = function (urls) {
    var self = this;

    urls.forEach(function (urlObj) {
        if (!Cache.get(urlObj.url)) {
            self.defer.push(urlObj);
        }
    });

    //console.log('[Defer]', self.defer.get());
    self.defer.pop(self.start);
};

Spider.prototype.start = function (urlObj) {
    urlObj = urlObj || {};
    url = urlObj.url || this.url;
    level = urlObj.level || 0;

    var self = this;

    level++;

    console.log('[Get url]', url, '[in level]', level);
    Util.get(url, function (data) {
        self.defer.resetIndex();

        //console.log('[start end]', urlObj);
        var hrefs = self._getHref(data, url);

        self.defer.pop(self.start);

        if (hrefs) {
            hrefs = self._setLevel(hrefs, level);
        }

        //Cache.set(url);
        hrefs && self.crawl(hrefs);
        //console.log('[start crawl]', urlObj);
    });
};

Spider.prototype._setLevel = function (urls, level) {
    return urls.map(function (url) {
        return {
            url: url,
            level: level
        };
    });
};

Spider.prototype._getImgUrls = function (imgs, pUrl) {
    var imgUrls = [];
    var reSrc = /src=['"]([^'"]+)['"]/;

    imgs && imgs.forEach(function (img) {
        var match = img.match(reSrc);

        match && imgUrls.push(Url.join(pUrl, match[1]));
    });

    return imgUrls;
};

Spider.prototype._getHref = function (data, pUrl) {
    var hrefs = data.match(reHref);
    var self = this;

    hrefs = hrefs && Url.filter(hrefs);

    hrefs = hrefs && hrefs.map(function (href) {
        return Url.join(pUrl, href);
    });

    var imgs = data.match(reImg) || [];
    imgs = this._getImgUrls(imgs, pUrl);
    //console.log(imgs);
    Log.append(imgs, 'images_log');

    // 如果设置了抓取同域，则没必要再执行该项
    // hrefs = Url.getMoreSimilaryUrls(hrefs);
    if (self.onlyHost) {
        hrefs = hrefs && hrefs.filter(function (href) {
            //return href.indexOf(pUrl) !== -1 && href.indexOf('.xml') === -1 && href.indexOf('.css') === -1 && href.indexOf('.js') === -1;
            return href.indexOf(pUrl) !== -1 && Util.canStoreType.indexOf(Util.getFileType(href)) === -1 && !Util.isIgnoreUrl(href);
        });
    }
    else {
        hrefs = hrefs && Url.getMoreSimilaryUrls(hrefs);
    }

    return hrefs;
};

module.exports = Spider;

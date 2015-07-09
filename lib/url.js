var url = require('url');
var path = require('path');

var reHttp = /(?:^https?:\/\/)?(?:www\.)?/;
var reStrictHttp = /^https?:\/\//;
var reSearch = /^\?/;

/**
 * @desc 规范化url，用于cache
 * @param {string} url 待规范化的url
 * @return 规范化后的url
 */
function normalize(url) {
    return url.replace(/\/#?$/, '')
              .replace(/\/\?/, '')
              .replace(/\/?#.*/, '');
}

//console.log(join('http://www.baidu.com/', '123', '/s', '?wd=123')); // 'http://www.baidu.com/s?wd=123'
function join() {
    var baseUrl = arguments[0];
    var needJoin = [].slice.call(arguments, 1);
    var joined = baseUrl;

    var urlObj = url.parse(baseUrl);
    var host;

    while(needJoin.length) {
        if (!reStrictHttp.test(baseUrl)) {
            joined = path.join.apply(null, arguments);
            break;
        }

        if (!host) {
            host = urlObj.protocol + '//' + urlObj.hostname;
        }

        var tmp = needJoin.shift();

        if (reStrictHttp.test(tmp)) {
            joined = tmp;
            continue;
        }

        if (/^\//.test(tmp)) {
            joined = host + tmp;
        }
        else {
            joined = joined.replace(/\/$/, '');

            if (!reSearch.test(tmp)) {
                joined += '/';
            }

            joined += tmp;
        }
    }

    return joined;
}

/**
 * @desc 得到两个url之间的相似程度
 * @param {string} url1 第一个url
 * @param {string} url2 第二个url
 * @return 返回两个url之间的相似程度
 */
function getDestence(url1, url2) {
    url1 = url1.replace(reHttp, '').replace(/\?.*/, '');
    url2 = url2.replace(reHttp, '').replace(/\?.*/, '');

    var len1 = url1.length;
    var len2 = url2.length;
    var tmp = [];

    if (!len1 || !len2) {
        return Math.max(len1, len2);
    }

    for (var i = 0; i <= len1; i++) {
        tmp[i] = [];
        for (var j = 0; j <= len2; j++) {
            if (!i) {
                tmp[i][j] = j;
            }
            else if (i && !j) {
                tmp[i][j] = i;
            }
            else {
                tmp[i][j] = 0;
            }
        }
    }

    var label = 0;

    for (i = 0; i < len1; i++) {
        for (j = 0; j < len2; j++) {
            if (url1[i] === url2[j]) {
                label = 0;
            }
            else {
                label = 1;
            }

            tmp[i + 1][j + 1] = Math.min(tmp[i][j + 1] + 1, tmp[i + 1][j] + 1, tmp[i][j] + label);
        }
    }

    return (1 - tmp[len1][len2] / Math.max(len1, len2));
}

/**
 * @desc 从一组url中找出相似度最高的一组
 */
function getMoreSimilaryUrls(urls) {
    var cache = {};
    var similary = {};
    var similaryThreshold = .8;

    for (var i = 0, len = urls.length; i < len; i++) {
        similary[urls[i]] = [];

        for (var j = i + 1; j < len; j++) {
            if (!cache[urls[j]]) {
                var simi = getDestence(urls[i].replace(reHttp, ''), urls[j].replace(reHttp, ''));
                console.log(simi);
                if (simi >= similaryThreshold) {
                    similary[urls[i]].push(urls[i]);
                    similary[urls[i]].push(urls[j]);

                    cache[urls[j]] = true;
                }
            }
        }

        if (!similary[urls[i]].length) {
            delete similary[urls[i]];
        }
    }

    //console.log(similary);
    return similary;
}

//console.log(getMoreSimilaryUrls(['http://www.baidu.com', 'http://www.baidu.com/search.html', 'http://qq.com', 'http://qqq.com', 'http://weibo.com']));
//console.log(getDestence('http://qqq.com', 'http://weibo.com'));

var reJavascriptHref = /^javascript:/i;
function filter(urls) {
    var fUrls = [];
    if (urls instanceof Array) {
        urls.forEach(function (u, index) {
            var re = filter(u);
            if (re) {
                fUrls = fUrls.concat(re);
            }
        });
    }
    else {
        urls = urls.replace(/^href=['"]/, '')
                   .replace(/['"]$/, '');

        if (!reJavascriptHref.test(urls)) {
            fUrls.push(urls);
        }
    }

    return !!fUrls.length && fUrls;
}

//console.log(filter(['href="baidu.com"', 'href="124.com"', 'href="javascript:"']));

module.exports = {
    join: join,
    filter: filter,
    normalize: normalize,
    getDestence: getDestence,
    getMoreSimilaryUrls: getMoreSimilaryUrls
}

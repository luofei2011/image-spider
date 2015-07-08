var url = require('url');
var path = require('path');

var reHttp = /^https?:\/\//;
var reSearch = /^\?/;

//join('http://www.baidu.com/', '123', '/s', '?wd=123'); // 'http://www.baidu.com/s?wd=123'
function join() {
	var baseUrl = arguments[0];
	var needJoin = [].slice.call(arguments, 1);
	var joined = baseUrl;

	var urlObj = url.parse(baseUrl);
	var host;

	while(needJoin.length) {
		if (!reHttp.test(baseUrl)) {
			joined = path.join.apply(null, arguments);
			break;
		}

		if (!host) {
			host = urlObj.protocol + '//' + urlObj.hostname;
		}

		var tmp = needJoin.shift();

		if (path.isAbsolute(tmp)) {
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
function get_destence(url1, url2) {
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

module.exports = {
	join: join,
	get_destence: get_destence
}

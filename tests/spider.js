var Spider = require('../spider');

var spider = new Spider('http://poised-flw.com', {
    level: 1,
    maxSockets: 6,
    downloadImage: true
});
spider.start();

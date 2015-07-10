var ImageSpider = require('../imageSpider');

var imageSpider = new ImageSpider({
    maxSockets: 2
});

imageSpider.add([
    'http://poised-flw.com/img/icons/git.png',
    'http://poised-flw.com/img/icons/logo.png',
    'http://poised-flw.com/img/icons/wb.png',
    'http://poised-flw.com/img/wx.png'
]);

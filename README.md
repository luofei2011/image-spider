#### INSTALL 

    # install nodejs packages
    npm install

    git clone https://github.com/luofei2011/image-spider.git
    cd image-spider
    touch test.js
    vim test.js

    # insert
    var Spider = require('./spider');

    var spider = new Spider('http://poised-flw.com');
    spider.start();

#### OPTIONS

`useAgent`: the ua of spider.

`maxSockets`: the concurrent number of spider.

`level`: the crawling depth of spider.

`onlyHost`: whether the spider only crawl the same domain website, default `true`.

#### OUTPUT 

1. The images src will be written to `$(pwd)/log/images_log`. you can download them use `download.sh`, or set `downloadImage: true`.

2. You can expand this tool to deal with js/css/html etc. files.

#### ISSUES

If there has any problem, Please let me know. thanks~

#### LICENSE

You can only use this for learning nodejs.

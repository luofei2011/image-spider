A spider for crawling images on the website.

#### INSTALL 

    # clone git repository
    git clone https://github.com/luofei2011/image-spider.git
    cd image-spider

    # install nodejs packages
    npm install

    # add test.js
    touch test.js
    vim test.js

    # insert 
    var Spider = require('./spider');
    var spider = new Spider('http://poised-flw.com', {
        level: 3,
        maxSockets: 4,
        downloadImage: true
    });
    spider.start();

    # save & quit
    # then. excute this file
    node test.js

#### OPTIONS

`useAgent`: the ua of spider.

`maxSockets`: the concurrent number of spider.

`level`: the crawling depth of spider.

`onlyHost`: whether the spider only crawl the same domain website, default `true`.

`downloadImage`: whether download the images, when crawling. default `false`.

#### OUTPUT 

1. The images src will be written to `$(pwd)/log/images_log`. you can download them use `download.sh`, or set `downloadImage: true`.

2. You can expand this tool to deal with js/css/html etc. files.

#### ISSUES

If there has any problem, Please let me know. thanks~

#### LICENSE

You can only use this for learning nodejs.

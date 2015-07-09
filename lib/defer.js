var extend = require('node.extend');

var Defer = function (options) {
    this.options = extend({}, this.options, options);
    this.stack = [];
    this.usedConnections = 0;
    this.spider = options.spider;
}

Defer.prototype = {
    constructor: Defer,
    options: {
        MAX_CONNECTIONS: 3
    },
    pop: function (cb) {
        if (!this.stack.length) return;

        if (this.usedConnections < this.options.MAX_CONNECTIONS) {
            this.usedConnections++;
            var urlObj = this.stack.shift();
            cb.call(this.spider, urlObj);

            // this is very important!!!
            // using parallel strategy.
            this.pop(cb);
        }
    },
    get: function () {
        return this.stack;
    },
    resetIndex: function () {
        this.usedConnections && this.usedConnections--;
    },
    push: function (url) {
        return this.stack.push(url);
    },
    destroy: function () {
        this.stack.length = 0;
        this.usedConnections = 0;
    }
}

module.exports = Defer;

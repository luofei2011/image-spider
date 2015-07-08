var extend = require('node.extend');

var Defer = function (options) {
    this.options = extend({}, this.options, options);
    this.stack = [];
    this.usedConnections = 0;
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
            cb(this.stack.shift());

            // this is very important!!!
            // using parallel strategy.
            this.pop(cb);
        }
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

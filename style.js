'use strict';

function Style(str) {
    var self = this;
    str.split(';').reduce((_, c) => {
        var attr = c.split(':');
        self[attr[0]] = attr[1];
    }, {});
}

Style.prototype.toString = function styleToString() {
    var self = this;
    var str = Object.keys(self).map(prop => 
            `${prop}: ${self[prop]}`
    ).join(';');
    return str;
};

module.exports = Style;
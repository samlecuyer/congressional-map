// npm i jsdom xmldom

const fs = require('fs');
const jsdom = require('jsdom');
const Style = require('./style');
const {DOMParser, XMLSerializer} = require('xmldom');

const html = fs.readFileSync('./sponsors.html');
const file = fs.readFileSync('./districts.svg');
const parser = new DOMParser;
const doc = parser.parseFromString(file.toString(), 'text/xml');

// ['Dividing_line'].forEach(id => {
//     var elem = doc.getElementById(id);
//     elem.parentNode.removeChild(elem);
// });

// var paths = doc.getElementsByTagName('path');
// for (var i = 0; i < paths.length; i++) {
//     var elem = paths.item(i);
//     let style = new Style(elem.getAttribute('style'));
//     style.fill = '#dadada';
//     style.stroke = 'none';

//     delete style['stroke-width'];
//     delete style['stroke-linejoin'];
//     delete style['stroke-opacity'];
//     delete style['stroke-linecap'];
//     delete style['stroke-dasharray'];
//     delete style['stroke-miterlimit'];
//     delete style['font-family'];
//     delete style['font-size'];
//     // console.log(style)
//     elem.setAttribute('style', style);
// }

// var newDoc = new XMLSerializer().serializeToString(doc);
// fs.writeFileSync('districts.svg', newDoc);

var all_states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

jsdom.env({
    // url: 'https://www.congress.gov/bill/114th-congress/house-bill/2903/cosponsors',
    html: html,
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function(err, window) {
        var $ = window.$;
        var actions = $('#display-message a, #main td.actions a');
        var states = [];
        actions.each(function() {
            const {id, party, state} = parseRepLine($(this).text());
            states.push(state)
            var elem = doc.getElementById(id);
            if (!elem) {
                return;
            }
            var style = new Style(elem.getAttribute('style'));
            if (party == 'D') {
                style.fill = '#2288cc';
            } else if (party == 'R') {
                style.fill = '#cc2233';
            }
            elem.setAttribute('style', style);
        });
        // console.log($.unique(states).sort())
        // console.log(all_states.length, $.unique(states).length)
        // console.log($(all_states).not($.unique(states)).get())
        var newDoc = new XMLSerializer().serializeToString(doc);
        fs.writeFileSync('map.svg', newDoc);
    }
})

function parseRepLine(rep) {
    const district = rep.match(/\[(.*?)\]/)[1].split('-');
    const party = district[0];
    const state = district[1];
    const number = district[2];
    const id = `${state}-${number === 'At Large' ? 'AL' : ('0' + number).substr(-2)}`;
    return {party, id, state};
}

// npm i jsdom xmldom

const fs = require('fs');
const jsdom = require('jsdom');
const Style = require('./style');
const {DOMParser, XMLSerializer} = require('xmldom');

const file = fs.readFileSync('./base-map.svg');
const parser = new DOMParser;
const doc = parser.parseFromString(file.toString(), 'text/xml');

jsdom.env({
    url: 'https://www.congress.gov/bill/114th-congress/house-bill/2903/cosponsors',
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function(err, window) {
        var $ = window.$;
        var actions = $('#main td.actions a');
        actions.each(function() {
            const {id, party} = parseRepLine($(this).text());
            var elem = doc.getElementById(id);
            if (!elem) return;
            var style = new Style(elem.getAttribute('style'));
            if (party == 'D') {
                style.fill = '#2288cc';
            } else if (party == 'R') {
                style.fill = '#cc2233';
            }
            elem.setAttribute('style', style);
        });
        var newDoc = new XMLSerializer().serializeToString(doc);
        fs.writeFileSync('map.svg', newDoc);
    }
})

function parseRepLine(rep) {
    const district = rep.match(/\[(.*?)\]/)[1].split('-');
    const party = district[0];
    const id = `${district[1]}_${district[2].replace(' ', '-')}`;
    return {party, id};
}

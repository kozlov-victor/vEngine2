
const dom = require('./dom');

module.exports = function(content) {
    const document = dom.createDocument(content,true);
    return `
        var document = require('@engine/misc/xmlUtils').Document;
        module.exports = document.create(${JSON.stringify(document.toJSON())});
    `;
};

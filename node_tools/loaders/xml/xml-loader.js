const XmlParser = require('../../build/xmlParser').XmlParser;

module.exports = function(content) {
    //console.log(this);
    const parser = new XmlParser(content);
    const node = parser.getTree();
    return `
        var document = require('@engine/misc/parsers/xml/xmlElements').XmlDocument;
        module.exports = document.create(${JSON.stringify(node.toJSON())});
    `;
};

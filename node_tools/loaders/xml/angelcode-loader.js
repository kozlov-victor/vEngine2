const AngelCodeParser = require('../../build/angelCodeParser').AngelCodeParser;

module.exports = function(content) {
    const parser = new AngelCodeParser(content);
    const node = parser.getTree();
    return `
        var document = require('@engine/misc/xml/xmlElements').XmlDocument;
        module.exports = document.create(${JSON.stringify(node)});
    `;
};



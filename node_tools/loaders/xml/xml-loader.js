
const dom = require('./dom');

module.exports = function(content) {
    const document = dom.createDocument(content,true);
    return `module.exports = ${JSON.stringify(document.toJSON())}`;
};


const tsquery = require("@phenomnomnominal/tsquery").tsquery;
const tstemplate = require("@phenomnomnominal/tstemplate").tstemplate;
const ts = require("typescript");

module.exports = function(content) {
    const ast = tsquery.ast(content,undefined,2); // tsx

    const allGenericMethods = tsquery(ast, `CallExpression:has(TypeReference)`);
    console.log(allGenericMethods);

    //return ts.createPrinter().printFile(ast);
    return content;
};

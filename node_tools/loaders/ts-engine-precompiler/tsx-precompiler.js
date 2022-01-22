const tsquery = require("@phenomnomnominal/tsquery").tsquery;
const ts = require('typescript');

let id = 0;

module.exports = function(content) {
    const ast = tsquery.ast(content,undefined,2); // tsx
    const allTsxNodes =
        [
            ...tsquery(ast, `JsxOpeningElement`),
            ...tsquery(ast, `JsxSelfClosingElement`),
        ];
    allTsxNodes.forEach(node=>{
        node.attributes.properties.push(
            // https://ts-ast-viewer.com/#code/G4QwTgBCELwQPAEwJbAgZxgbwMwF8A+eAehWAKA
            ts.createJsxAttribute(
                ts.createIdentifier("__id"),
                ts.createJsxExpression(
                    undefined,
                    ts.createNumericLiteral(`${id}`)
                )
            )
        );
        id++;
    });
    return ts.createPrinter().printFile(ast);
}

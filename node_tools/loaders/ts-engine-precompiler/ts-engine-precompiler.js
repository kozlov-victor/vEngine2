
const tsquery = require("@phenomnomnominal/tsquery").tsquery;
const tstemplate = require("@phenomnomnominal/tstemplate").tstemplate;
const ts = require("typescript");

const decoratorNamesToProcess = [
    'Texture','Sound','CubeTexture','Text', 'Font', 'FontFromAtlas'
];

module.exports = function(content) {
    const ast = tsquery.ast(content,undefined,2); // tsx

    const allClasses = tsquery(ast, `ClassDeclaration`);
    let modified = false;

    allClasses.forEach(cl=>{
        const allDecoratedFields = tsquery(cl,
            [
                decoratorNamesToProcess.map(it=>`PropertyDeclaration:has(Decorator:has(Identifier[name="${it}"]))`).join(',')
            ].join(',')
        );
        if (allDecoratedFields.length===0) return;
        modified = true;
        const preloadingMethods = tsquery(cl, `MethodDeclaration:has(Identifier[name="onPreloading"])`);
        let preloadingMethod = preloadingMethods[0];
        if (preloadingMethod===undefined) {
            preloadingMethod = tsquery(tstemplate.compile(`
                class Template {
                    public onPreloading(){
                        super.onPreloading();
                    }
                }
            `)({}),`MethodDeclaration:has(Identifier[name="onPreloading"])`)[0];
            cl.members.push(preloadingMethod);
        }
        const statements = [];
        allDecoratedFields.forEach(f=> {
            const newDecorators = [];
            f.decorators.forEach((d) => {
                const decoratorName =
                    d.expression &&
                    d.expression.expression &&
                    d.expression.expression.name &&
                    d.expression.expression.name.escapedText;
                if (decoratorName && decoratorNamesToProcess.includes(decoratorName)) {
                    const decoratorArgs = d.expression.arguments;
                    const statement = tsquery(tstemplate.compile(`
                    class Template {
                        public onPreloading(){
                            this.resourceLoader.addNextTask(()=>{
                               this.<%=fieldName%> = this.resourceLoader.load${decoratorName}(<%=args%>);
                            });
                        }
                    }
                    `)({
                        fieldName: ts.createIdentifier(f.name.escapedText),
                        args: decoratorArgs
                    }), `MethodDeclaration:has(Identifier[name="onPreloading"])`)[0].body.statements[0];
                    statements.push(statement);
                } else {
                    newDecorators.push(d);
                }
            });
            f.decorators = newDecorators;
        });

        const internalMethod = tsquery(tstemplate.compile(`
                class Template {
                    public __getNumberOfResourcesToPreload():number{
                        return <%=n%>;
                    }
                }
            `)({n:ts.createLiteral(statements.length)}),`MethodDeclaration:has(Identifier[name="__getNumberOfResourcesToPreload"])`)[0];
        cl.members.push(internalMethod);

        preloadingMethod.body.statements = [...preloadingMethod.body.statements, ...statements];

    });
    if (!modified) return content;
    return ts.createPrinter().printFile(ast);
};

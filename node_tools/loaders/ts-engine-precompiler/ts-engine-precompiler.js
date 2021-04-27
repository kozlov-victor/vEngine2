
const tsquery = require("@phenomnomnominal/tsquery").tsquery;
const tstemplate = require("@phenomnomnominal/tstemplate").tstemplate;
const ts = require("typescript");

const decoratorNamesToProcess = [
    'Texture', 'Image', 'Sound', 'CubeTexture', 'Text', 'JSON', 'FontFromCssDescription', 'FontFromAtlas'
];

const createStatementsForPreloadingMethod = (template,params)=>{

    const compiledTemplate =
        tstemplate.compile(`
            class Template {
                public templateMethod():void{
                    ${template}
                }
            }`
        )(params);

    return tsquery(
        compiledTemplate,
        `MethodDeclaration:has(Identifier[name="templateMethod"])`
    )[0].body.statements;
}

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
        let preloadingMethod = tsquery(cl, `MethodDeclaration:has(Identifier[name="onPreloading"])`)[0];
        if (preloadingMethod===undefined) {
            preloadingMethod = tsquery(tstemplate.compile(`
                class Template {
                    public onPreloading(taskQueue:any):void{
                        super.onPreloading(taskQueue);
                    }
                }
            `)({}),`MethodDeclaration:has(Identifier[name="onPreloading"])`)[0];
            cl.members.push(preloadingMethod);
        }
        const preloadingMethodFirstArg =
            preloadingMethod.parameters &&
            preloadingMethod.parameters[0] &&
            preloadingMethod.parameters[0].name;
        //if (preloadingMethodFirstArg===undefined) throw new Error(`wrong arguments of onPreloading method`);
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
                    const loadingStatements = createStatementsForPreloadingMethod(
                        `
                         <%=taskQueue%>.addNextTask(async (progress:(n:number)=>void):Promise<void>=>{
                            this.<%=fieldName%> = await <%=taskQueue%>.getLoader().load${decoratorName}(<%=args%>,progress);
                        });
                        `,
                        {
                            fieldName: ts.createIdentifier(f.name.escapedText),
                            args: decoratorArgs,
                            taskQueue:preloadingMethodFirstArg
                        }
                    );
                    statements.push(...loadingStatements);
                } else {
                    newDecorators.push(d);
                }
            });
            f.decorators = newDecorators;
        });

        //const autoHolderDecoratedFields = tsquery(cl, `PropertyDeclaration:has(Decorator:has(Identifier[name="ResourceAutoHolder"]))`);

        preloadingMethod.body.statements = [...preloadingMethod.body.statements, ...statements];

    });
    if (!modified) return content;
    return ts.createPrinter().printFile(ast);
};

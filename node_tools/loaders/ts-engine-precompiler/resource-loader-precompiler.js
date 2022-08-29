
const tsquery = require("@phenomnomnominal/tsquery").tsquery;
const tstemplate = require("@phenomnomnominal/tstemplate").tstemplate;
const ts = require("typescript");

const decoratorNamesToProcess = [
    'Texture', 'Image', 'Sound',
    'CubeTexture', 'Text',
    'JSON', 'XML', 'YAML',
    'FontFromCssDescription', 'FontFromAtlas','FontFromAtlasUrl',
    'Binary',
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
    const type = this.resourcePath.endsWith('.tsx')?4:3;
    const ast = tsquery.ast(content,undefined,type);

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
                    public override onPreloading(taskQueue:any):void{
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

        const statements = [];
        allDecoratedFields.forEach(f=> {
            const newModifiers = [];
            f.modifiers.forEach((d) => {
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
                            (this as any).<%=fieldName%> = await <%=taskQueue%>.getLoader().load${decoratorName}(<%=args%>,progress);
                        });
                        `,
                        {
                            fieldName: ts.factory.createIdentifier(f.name.escapedText),
                            args: decoratorArgs,
                            taskQueue:preloadingMethodFirstArg
                        }
                    );
                    statements.push(...loadingStatements);
                } else {
                    newModifiers.push(d);
                }
            });
            f.modifiers = newModifiers;
        });

        preloadingMethod.body.statements = [...preloadingMethod.body.statements, ...statements];

    });

    allClasses.forEach(cl=> {
        const allDecoratedFields = tsquery(cl, `PropertyDeclaration:has(Decorator:has(Identifier[name="ResourceHolder"]))`);
        if (allDecoratedFields.length === 0) return;
        modified = true;
        allDecoratedFields.forEach(f => {
            const newModifiers = [];
            f.modifiers.forEach((d) => {
                const decoratorName =
                    d.expression &&
                    d.expression.expression &&
                    d.expression.expression.name &&
                    d.expression.expression.name.escapedText;
                if (decoratorName && decoratorName === 'ResourceHolder') {
                    const factory = ts.factory;
                    // require("@engine/resources/injectResourceHolderHelper").injectResourceHolder(this,Assets);
                    f.initializer =
                        factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                                factory.createCallExpression(
                                    factory.createIdentifier("require"),
                                    undefined,
                                    [factory.createStringLiteral("@engine/resources/injectResourceHolderHelper")]
                                ),
                                factory.createIdentifier("__injectResourceHolder")
                            ),
                            undefined,
                            [
                                factory.createThis(),
                                factory.createIdentifier(f.type?.typeName?.escapedText || 'undefined')
                            ]
                        )
                } else {
                    newModifiers.push(d);
                }
            });
            f.modifiers = newModifiers;
        });
    });

    if (!modified) return content;
    return ts.createPrinter().printFile(ast);
};


declare const __non_webpack_require__:any;

const ts = __non_webpack_require__ ('typescript') as any;

const stringAsClearedArray = (content:string):string[]=>{
    return content.
    split('\r').join('\n').
    split('\n').
    filter(it=>!!it.trim()).
    filter(it=>!it.startsWith('//'));
};


// @ts-ignore
const engineTransformer = <T extends ts.Node>(context: ts.TransformationContext) => {
    // @ts-ignore
    return (rootNode: ts.SourceFile) => {
        // @ts-ignore
        function visit(node: ts.Node): ts.Node {
            if (node.kind===ts.SyntaxKind.TaggedTemplateExpression) {
                const [tag, template] = node.getChildren();
                if (tag.getText()==='MACRO_GL_COMPRESS') {
                    let text:string = template.getText().slice(1,-1);
                    text = stringAsClearedArray(text).map((it:string)=>it.trim()).filter((it:string)=>!!it).join('\n');
                    return ts.createStringLiteral(text);
                }
            }
            return ts.visitEachChild(node, visit, context);
        }
        return ts.visitNode(rootNode, visit);
    };
};

if (typeof exports!=='undefined') {
    exports.engineTransformer = engineTransformer;
}

import * as ts from 'typescript';

// @ts-ignore
import {stringAsClearedArray} from "../../common/common";


export const engineTransformer = <T extends ts.Node>(context: ts.TransformationContext) => {
    return (rootNode: ts.SourceFile) => {
        function visit(node: ts.Node): ts.Node {
            if (node.kind===ts.SyntaxKind.TaggedTemplateExpression) {
                const [tag, template] = node.getChildren();
                if (tag.getText()==='MACRO_GL_COMPRESS') {
                    let text:string = template.getText().slice(1,-1);
                    text = stringAsClearedArray(text).map((it:string)=>it.trim()).filter((it:string)=>!!it).join('\n');
                    return ts.createLiteral(text);
                }
            }
            return ts.visitEachChild(node, visit, context);
        }
        return ts.visitNode(rootNode, visit);
    };
};
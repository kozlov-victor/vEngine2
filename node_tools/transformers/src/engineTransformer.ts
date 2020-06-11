import * as ts from 'typescript';

// @ts-ignore
import {stringAsClearedArray} from "../../common/common";
import {tsquery} from "@phenomnomnominal/tsquery";
import {tstemplate} from "@phenomnomnominal/tstemplate";


export const engineTransformer = <T extends ts.Node>(context: ts.TransformationContext) => {
    return (rootNode: ts.SourceFile) => {
        function visit(node: ts.Node): ts.Node {
            if (node.kind===ts.SyntaxKind.TaggedTemplateExpression) {
                const [tag, template] = node.getChildren();
                if (tag.getText()==='MACRO_GL_COMPRESS') {
                    let text:string = template.getText().slice(1,-1);
                    text = stringAsClearedArray(text).map((it:string)=>it.trim()).filter((it:string)=>!!it).join('\n');
                    return ts.createStringLiteral(text);
                    // const expressions:ts.Expression[] = [];
                    // const literals:ts.TemplateLiteralLikeNode[] = [];
                    // const statements:ts.Node[] = [];
                    // ((node as ts.TaggedTemplateExpression)?.template as ts.TemplateExpression)?.templateSpans?.forEach(it=>{
                    //     if (it.expression) expressions.push(it.expression);
                    //     if (it.literal) literals.push(it.literal);
                    // });
                    // expressions.forEach((ex,i)=>{
                    //     statements.push(ex);
                    //     console.log(literals[i].text);
                    //     statements.push(ts.createLiteral(literals[i].text));
                    // });
                    // console.log('---------------------------------------',statements);
                    // return (tsquery(tstemplate.compile(
                    //     `var template = [<%=statements%>].join(<%=EMPTY_STR%>);`,
                    // )({statements,EMPTY_STR:''}),'*')[0] as any).statements[0].declarationList.declarations[0].initializer;
                }
            }
            return ts.visitEachChild(node, visit, context);
        }
        return ts.visitNode(rootNode, visit);
    };
};

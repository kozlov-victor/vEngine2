
// https://github.com/searchfe/ts2php/blob/master/src/emitter.ts
// tsc .\node_tools\transpiler\toJava.ts | node .\node_tools\transpiler\toJava.js


import * as ts from 'typescript';
import {ScriptKind} from 'typescript';

const code = `


// class A {
//
//     protected a:number = 1+4;
//
//     private static testMethod(param1:string,param2:string):string {
//         return "3";
//     }
// }

`;

const sourceFile = ts.createSourceFile('temp.ts', code,ts.ScriptTarget.ESNext,false,ScriptKind.TSX);
// const program = ts.createProgram({
//     rootNames: [],
//     options: {}
// });
// const typeChecker = program.getTypeChecker();

class CodeBuilder {

    private code:string = '';

    constructor() {

    }
    println(line:string,indent:boolean = false){
        this.print(line,indent);
        this.print('\n');
    }
    print(line:string,indent:boolean = false){
        if (indent) this.code+=new Array(indent)
        this.code+=line;
    }
    toCode() {
        return this.code;
    }
}

const codeBuilder = new CodeBuilder();

const emitClassDeclaration = (node:ts.ClassDeclaration):void=> {
    emitModifiers(node, node.modifiers);
    codeBuilder.print('class ');
    codeBuilder.print(node!.name!.escapedText.toString());

    if (node.heritageClauses && node.heritageClauses.length > 0) {
        //emitList(node, node.heritageClauses);
    }
    codeBuilder.println('{');
    //emitList(node, node.members);
    node.forEachChild(visitNode);
    codeBuilder.println('}');
}

const emitMethodDeclaration = (node:ts.MethodDeclaration):void=> {
    emitModifiers(node, node.modifiers);
    codeBuilder.print(node.type!.getText(sourceFile));
    codeBuilder.print(' ');
    codeBuilder.print(node.name.getText(sourceFile));
    codeBuilder.print('(');
    node.parameters.forEach((p,i)=>{
        codeBuilder.print(p.type!.getText(sourceFile));
        codeBuilder.print(' ');
        codeBuilder.print(p.name.getText(sourceFile));
        if (i<node.parameters.length-1) codeBuilder.print(',');
    });
    codeBuilder.print(')');
    codeBuilder.println('{');
    node.forEachChild(visitNode);
    codeBuilder.println("");
    codeBuilder.println('}');
}

const emitPropertyDeclaration = (node:ts.PropertyDeclaration):void=>{
    emitModifiers(node, node.modifiers);
    codeBuilder.print(node.type!.getText(sourceFile));
    codeBuilder.print(' ');
    codeBuilder.print(node.name.getText(sourceFile));
    if (node.getChildCount(sourceFile)) {
        codeBuilder.print('=');
        node.forEachChild(visitNode);
    }
    codeBuilder.println(';');
}

const emitModifiers = (node: ts.ClassDeclaration | ts.MethodDeclaration | ts.PropertyDeclaration, modifiers: ts.NodeArray<ts.Modifier> | undefined):void=> {
    if (modifiers && modifiers.length) {
        modifiers.forEach((m,i)=>{
            codeBuilder.print(m.getText(sourceFile));
            codeBuilder.print(' ');
        });
    }
}

let indent = 1;

function visitNode(node:ts.Node) {
    console.log(new Array(indent||1).fill(' ').join('')+ts.SyntaxKind[node.kind]+`(${node.kind})`);
    indent++;
    switch (node.kind) {
        //case ts.SyntaxKind.ExpressionStatement:
        //case ts.SyntaxKind.BinaryExpression:
        case ts.SyntaxKind.SourceFile:
        case ts.SyntaxKind.EndOfFileToken:
        {
            node.forEachChild(visitNode);
            break;
        }
        case ts.SyntaxKind.ClassDeclaration: {
            emitClassDeclaration(node as ts.ClassDeclaration);
            break;
        }
        case ts.SyntaxKind.MethodDeclaration: {
            emitMethodDeclaration(node as ts.MethodDeclaration);
            break;
        }
        case ts.SyntaxKind.PropertyDeclaration: {
            emitPropertyDeclaration(node as ts.PropertyDeclaration)
            break;
        }
        case ts.SyntaxKind.ReturnStatement: {
            codeBuilder.print('return ');
            node.forEachChild(visitNode);
            break;
        }
        case ts.SyntaxKind.StringLiteral: {
            codeBuilder.print(node.getText(sourceFile));
            break;
        }
        // case ts.SyntaxKind.Identifier: {
        //     codeBuilder.print(-1,` ${node.getText(sourceFile)}`);
        //     break;
        // }
        case ts.SyntaxKind.FirstLiteralToken: {
            codeBuilder.print(node.getText(sourceFile));
            break;
        }
        case ts.SyntaxKind.PlusToken: {
            codeBuilder.print('+');
            break;
        }
        case ts.SyntaxKind.ExpressionStatement: {
            node.forEachChild(visitNode);
            break;
        }
        case ts.SyntaxKind.FirstTemplateToken: {
            node.forEachChild(visitNode);
            break;
        }
        default: {
            //codeBuilder.println(`unknown node: ${ts.SyntaxKind[node.kind]} (${node.kind})`);
            node.forEachChild(visitNode);
        }
    }
    indent--;
}

visitNode(sourceFile);

console.log(codeBuilder.toCode());

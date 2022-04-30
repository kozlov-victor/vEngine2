
// https://github.com/searchfe/ts2php/blob/master/src/emitter.ts
// tsc .\node_tools\transpiler\toJava.ts | node .\node_tools\transpiler\toJava.js
// node node_modules\typescript\bin\tsc .\node_tools\transpiler\toJava.ts | node .\node_tools\transpiler\toJava.js

import * as ts from 'typescript';
import {ScriptKind} from 'typescript';

//language=TypeScript
const code = `

class A {

    //protected a:string = 1 + 4 + "3";

    protected doIt():void {
        let a:number = 2;
        a=a+2;
        return;
    }

    // private static testMethod(param1:number,param2:string):string {
    //    const s:string = "str0";
    //    const s1:string = "str1" + "str2" + param1;
    //    return s+8+s1 + param1;
    // }
}
//const s1:string = "str1" + "str2".substr(0,1);
`;

const sourceFile = ts.createSourceFile('temp.ts', code,ts.ScriptTarget.ESNext,false,ScriptKind.TSX);

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
    node.members.forEach(visitNode);
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
    node.body?.forEachChild(visitNode);
    codeBuilder.println("");
    codeBuilder.println('}');
}

const emitPropertyDeclaration = (node:ts.PropertyDeclaration):void=>{
    emitModifiers(node, node.modifiers);
    const propName = node.name.getText(sourceFile);
    const propType = node.type!.getText(sourceFile);
    codeBuilder.print(propType);
    codeBuilder.print(' ');
    codeBuilder.print(propName);
    if (node.initializer) {
        codeBuilder.print('=');
        node.forEachChild(visitNode);
    }
    codeBuilder.println(';');
}

const emitVariableDeclaration = (node:ts.VariableDeclaration):void=>{
    const varName = node.name.getText(sourceFile);
    const varType = node.type!.getText(sourceFile);
    codeBuilder.print(varType);
    codeBuilder.print(' ');
    codeBuilder.print(varName);
    if (node.initializer) {
        codeBuilder.print('=');
        if (node.initializer.getChildCount(sourceFile)) {
            node.initializer.forEachChild(visitNode);
        } else {
            codeBuilder.print(node.initializer.getText(sourceFile));
        }
    } else {
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
        case ts.SyntaxKind.SourceFile:
        case ts.SyntaxKind.EndOfFileToken: {
            node.forEachChild(visitNode);
            break;
        }
        case ts.SyntaxKind.BinaryExpression: {
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
            emitPropertyDeclaration(node as ts.PropertyDeclaration);
            break;
        }
        case ts.SyntaxKind.Block: {
            node.forEachChild(visitNode);
            break;
        }
        case ts.SyntaxKind.FirstStatement: {
            node.forEachChild(visitNode);
            break;
        }
        case ts.SyntaxKind.VariableDeclarationList: {
            node.forEachChild(visitNode);
            break;
        }
        case ts.SyntaxKind.VariableDeclaration: {
            emitVariableDeclaration(node as ts.VariableDeclaration);
            break;
        }
        case ts.SyntaxKind.ReturnStatement: {
            codeBuilder.print('return ');
            node.forEachChild(visitNode);
            codeBuilder.println(';');
            break;
        }
        case ts.SyntaxKind.PropertyAccessExpression: {
            //codeBuilder.print('.');
            node.forEachChild(visitNode);
            break;
        }
        case ts.SyntaxKind.CallExpression: {
            codeBuilder.print('(');
            node.forEachChild(visitNode);
            codeBuilder.print(')');
            break;
        }
        case ts.SyntaxKind.StringLiteral: {
            codeBuilder.print(node.getText(sourceFile));
            break;
        }
        case ts.SyntaxKind.Identifier: {
            codeBuilder.print(node.getText(sourceFile));
            break;
        }
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
        case ts.SyntaxKind.FirstAssignment: {
            node.forEachChild(visitNode);
            break;
        }
        case ts.SyntaxKind.ProtectedKeyword:
        case ts.SyntaxKind.StringKeyword:
        case ts.SyntaxKind.NumberKeyword: {
            break;
        }
        default: {
            codeBuilder.println(`unknown node: <${ts.SyntaxKind[node.kind]} (${node.kind})>`);
            node.forEachChild(visitNode);
        }
    }
    indent--;
}

visitNode(sourceFile);

console.log(codeBuilder.toCode());

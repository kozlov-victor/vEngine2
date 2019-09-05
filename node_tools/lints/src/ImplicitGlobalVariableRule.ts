
import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'not allowed to use: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new LintWalker(sourceFile, 'implicit-global-variable'));
    }
}

class LintWalker extends Lint.AbstractWalker {

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            // Finds specific node types and do checking.
            if (ts.isToken(node)) {
                this.checkStatement(node);
            } else {
                // Continue rescursion: call function `cb` for all children of the current node.
                return ts.forEachChild(node, cb);
            }
        };
        // Start recursion for all children of `sourceFile`.
        return ts.forEachChild(sourceFile, cb);
    }


    private checkStatement(node:ts.Node) {
        const source:string = this.getSourceFile().getFullText();
        const statementName = source.substring(node.pos,node.end).trim();
        if (['name','length'].indexOf(statementName)>-1) {
            const isPreviousDot = source[node.pos-1]==='.';
            if (!isPreviousDot) this.addFailure(node.pos,node.end,`potentially unsafe statement name "${statementName}"`);
        }
    }

}

// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        // create a failure at the current position
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));

        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }
}


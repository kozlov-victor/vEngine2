
import * as ts from 'typescript';
import * as Lint from 'tslint';

// noinspection JSUnusedGlobalSymbols
export class Rule extends Lint.Rules.AbstractRule {
    // noinspection JSUnusedGlobalSymbols
    public static FAILURE_STRING = 'not allowed to use: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new LintWalker(sourceFile, 'vEngine-as-statement',undefined));
    }
}

class LintWalker extends Lint.AbstractWalker {

    public walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            // Finds specific node types and do checking.
            if (ts.isAsExpression(node)) {
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
        this.addFailure(node.pos,node.end,`potentially unsafe statement "as"`);
    }

}


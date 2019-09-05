"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var Lint = require("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new LintWalker(sourceFile, 'implicit-global-variable'));
    };
    Rule.FAILURE_STRING = 'not allowed to use: ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var LintWalker = /** @class */ (function (_super) {
    __extends(LintWalker, _super);
    function LintWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LintWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            // Finds specific node types and do checking.
            if (ts.isToken(node)) {
                _this.checkStatement(node);
            }
            else {
                // Continue rescursion: call function `cb` for all children of the current node.
                return ts.forEachChild(node, cb);
            }
        };
        // Start recursion for all children of `sourceFile`.
        return ts.forEachChild(sourceFile, cb);
    };
    LintWalker.prototype.checkStatement = function (node) {
        var source = this.getSourceFile().getFullText();
        var statementName = source.substring(node.pos, node.end).trim();
        if (['name', 'length'].indexOf(statementName) > -1) {
            var isPreviousDot = source[node.pos - 1] === '.';
            if (!isPreviousDot)
                this.addFailure(node.pos, node.end, "potentially unsafe statement name \"" + statementName + "\"");
        }
    };
    return LintWalker;
}(Lint.AbstractWalker));
// The walker takes care of all the work.
var NoImportsWalker = /** @class */ (function (_super) {
    __extends(NoImportsWalker, _super);
    function NoImportsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoImportsWalker.prototype.visitImportDeclaration = function (node) {
        // create a failure at the current position
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    return NoImportsWalker;
}(Lint.RuleWalker));

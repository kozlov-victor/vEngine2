
const ts = require('typescript');

exports.stringAsClearedArray = (content)=>{
    return content.
        split('\r').join('\n').
        split('\n').
        filter(it=>!!it.trim()).
        filter(it=>!it.startsWith('//'));
};

function compile(fileNames, options) {
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();

    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(
                diagnostic.messageText,
                "\n"
            );
            console.log(
                `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
            );
        } else {
            console.log(
                `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
            );
        }
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Process exiting with code '${exitCode}'.`);
    process.exit(exitCode);
}

exports.compile = (files,outDir)=>{
    compile(files, {
        noEmitOnError: true,
        noImplicitAny: true,
        outDir,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
    });
};


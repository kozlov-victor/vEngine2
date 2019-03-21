const fs = require('fs');

const macrosBodyCache = {};

const getMacrosBody = (url)=>{
    if (macrosBodyCache[url]) return macrosBodyCache[url];
    if (!fs.existsSync(url)) {
        throw new Error(`can not find macros ${url}`);
    }
    const macrosSrc = fs.readFileSync(url,{encoding: 'utf8'});
    let body = '';
    let inMacros = false;
    let bodyJustStarted = false;
    let bodyJustFinished = false;
    macrosSrc.split('\r').forEach(line=>{

        bodyJustStarted = false;
        bodyJustFinished = false;

        if (line.indexOf('#MACROS_BODY_BEGIN')>-1) {
            inMacros = true;
            bodyJustStarted = true;
        }
        if (line.indexOf('#MACROS_BODY_END')>-1) {
            inMacros = false;
            bodyJustFinished = true;
        }
        if (inMacros) {
            if (!bodyJustStarted && !bodyJustFinished) body+=line+'\n';
        }

    });
    return body;
};

const dedent = (callSite, ...args)=> {

    function format(str) {

        let size = -1;

        return str.replace(/\n(\s+)/g, (m, m1) => {

            if (size < 0)
                size = m1.replace(/\t/g, "    ").length;

            return "\n" + m1.slice(Math.min(m1.length, size));
        });
    }

    if (typeof callSite === "string")
        return format(callSite);

    if (typeof callSite === "function")
        return (...args) => format(callSite(...args));

    let output = callSite
        .slice(0, args.length + 1)
        .map((text, i) => (i === 0 ? "" : args[i - 1]) + text)
        .join("");

    return format(output);
};



module.exports = function(content) {
    let sourceModified = '';
    if (content.indexOf('#MACROS_BODY_BEGIN')>-1) {
        const lines = content.split('\n');
        let inMacros = false, bodyJustStarted = false, bodyJustFinished = false;
        lines.forEach(line=>{
            bodyJustStarted = false;
            bodyJustFinished = false;
            if (line.indexOf('#MACROS_BODY_BEGIN')>-1) {
                inMacros = true;
                bodyJustStarted = true;
                let macrosFilePath = line.split('=')[1];
                if (macrosFilePath) {
                    macrosFilePath = macrosFilePath.trim().replace('\r','');
                    macrosFilePath+='.ts';
                }
                sourceModified +=
                    dedent`
                     // generated macros from ${macrosFilePath}
                     //--macros start--- 
                     ${getMacrosBody(macrosFilePath)}
                     //--macros end--
                    `;
            } else if (line.indexOf('#MACROS_BODY_END')>-1) {
                inMacros = false;
                bodyJustFinished = true;
            }

            if (!inMacros) {
                if (!bodyJustStarted && !bodyJustFinished) {
                    sourceModified +=line+'\n';
                }
            }

        });
        if (inMacros) throw new Error(`macros body is not closed`);
    } else {
        sourceModified = content;
    }

    return sourceModified;

};
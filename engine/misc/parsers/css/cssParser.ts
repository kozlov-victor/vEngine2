
// according to
// https://github.com/jotform/css.js/blob/master/css.js

import {XmlNode} from "@engine/misc/parsers/xml/xmlElements";

interface CssRule {
    directive: string;
    value: string;
    defective?: true;
    type?: string;
}

interface CssObject {
    selector: string[];
    type: string;
    comments: string;
    styles: any;
    subStyles: CssObject[];
    rules: CssRule[];
}

export class CssParser {

    private cssKeyframeRegex = '((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
    private combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})'; //to match css & media queries together
    private cssCommentsRegex = '(\\/\\*[\\s\\S]*?\\*\\/)';
    private cssImportStatementRegex = new RegExp('@import .*?;', 'gi');

    private parsed:CssObject[] = [];

    public parseCSS(source:string):CssObject[] {
        if (source === undefined) {
            return [];
        }

        const css:CssObject[] = [];
        //strip out comments
        //source = this.stripComments(source);

        //get import statements

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const imports = this.cssImportStatementRegex.exec(source);
            if (imports !== null) {
                //this.cssImportStatements.push((imports)[0]);
                css.push({
                    selector: ['@imports'],
                    type: 'imports',
                    styles: imports[0],
                    rules: [],
                    comments: '',
                    subStyles: [],
                });
            } else {
                break;
            }
        }
        source = source.replace(this.cssImportStatementRegex, '');
        //get keyframe statements
        const keyframesRegex = new RegExp(this.cssKeyframeRegex, 'gi');
        let arr;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            arr = keyframesRegex.exec(source);
            if (arr === null) {
                break;
            }
            css.push({
                selector: ['@keyframes'],
                type: 'keyframes',
                styles: arr[0],
                rules: [],
                comments: '',
                subStyles: [],
            });
        }
        source = source.replace(keyframesRegex, '');

        //unified regex
        const unified = new RegExp(this.combinedCSSRegex, 'gi');

        // eslint-disable-next-line no-constant-condition
        while (true) {
            arr = unified.exec(source);
            if (arr === null) {
                break;
            }
            let selector = '';
            if (arr[2] === undefined) {
                selector = arr[5].split('\r\n').join('\n').trim();
            } else {
                selector = arr[2].split('\r\n').join('\n').trim();
            }

            /*
              fetch comments and associate it with current selector
            */
            const commentsRegex = new RegExp(this.cssCommentsRegex, 'gi');
            const comments = commentsRegex.exec(selector);
            if (comments !== null) {
                selector = selector.replace(commentsRegex, '').trim();
            }

            // Never have more than a single line break in a row
            selector = selector.replace(/\n+/, "\n");

            //determine the type
            if (selector.indexOf('@media') !== -1) {
                //we have a media query
                const cssObject:CssObject = {
                    selector: [selector],
                    type: 'media',
                    comments: '',
                    rules: [],
                    styles: [],
                    subStyles: this.parseCSS(arr[3] + '\n}') //recursively parse media query inner css
                };
                if (comments !== null) {
                    cssObject.comments = comments[0];
                }
                css.push(cssObject);
            } else {
                //we have standard css
                const rules = CssParser.parseRules(arr[6]);
                const style:CssObject = {
                    selector: selector.split(','),
                    rules: rules,
                    subStyles: [],
                    styles: [],
                    comments: '',
                    type: undefined!
                }
                if (selector === '@font-face') {
                    style.type = 'font-face';
                }
                if (comments !== null) {
                    style.comments = comments[0];
                }
                css.push(style);
            }
        }
        this.parsed = css;
        return css;
    }

    private static parseRules(rulesStr: string):CssRule[] {
        //convert all windows style line endings to unix style line endings
        rulesStr = rulesStr.split('\r\n').join('\n');
        const ret:CssRule[] = [];

        const rules = rulesStr.split(';');

        //process rules line by line
        for (let i = 0; i < rules.length; i++) {
            let lineStr = rules[i];

            //determine if line is a valid css directive, ie color:white;
            lineStr = lineStr.trim();
            if (lineStr.indexOf(':') !== -1) {
                //line contains :
                const line = lineStr.split(':');
                const cssDirective = line[0].trim();
                const cssValue = line.slice(1).join(':').trim();

                //more checks
                if (cssDirective.length < 1 || cssValue.length < 1) {
                    continue; //there is no css directive or value that is of length 1 or 0
                    // PLAIN WRONG WHAT ABOUT margin:0; ?
                }

                //push rule
                ret.push({
                    directive: cssDirective,
                    value: cssValue
                });
            } else {
                //if there is no ':', but what if it was mis splitted value which starts with base64
                if (lineStr.trim().substr(0, 7) === 'base64,') { //hack :)
                    ret[ret.length - 1].value += lineStr.trim();
                } else {
                    //add rule, even if it is defective
                    if (lineStr.length > 0) {
                        ret.push({
                            directive: '',
                            value: lineStr,
                            defective: true
                        });
                    }
                }
            }
        }

        return ret; //we are done!
    }

    public getRulesBySelector(selector:string):Record<string, string> {
        const ret:Record<string, string> = {};
        this.parsed.forEach(rule=>{
            if (rule.selector.includes(selector)) {
                rule.rules.forEach(r=>{
                    ret[r.directive] = r.value;
                })
            }
        });
        return ret;
    }

    public getRulesForElement(el:XmlNode):Record<string, string> {
        const byClass = this.getRulesBySelector(`.${el.getAttribute('class')}`);
        const byId = this.getRulesBySelector(`#${el.getAttribute('id')}`);
        Object.keys(byId).forEach(key=>{
            byClass[key] = byId[key];
        })
        return byClass;
    }


}

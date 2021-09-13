import {IXmlTextNode, XmlNode} from "@engine/misc/xml/xmlELements";

interface IParseError {
    key: string;
    text: string;
    line: number;
    code?:string;
}

export class XmlParser {

    constructor(text:string) {
        this.text = text;
        if (this.text) {
            this.parse();
            this.afterParsed();
        }
    }

    private readonly text:string;

    private tree:XmlNode = new XmlNode();
    private errors:IParseError[] = [];

    private preserveWhitespace = false;
    private lowerCase = false;

    private patTag = /([^<]*?)<([^>]+)>/g;
    private patSpecialTag = /^\s*([!?])/;
    private patPITag = /^\s*\?/;
    private patStandardTag = /^\s*(\/?)([\w\-:.]+)\s*([\s\S]*)$/;
    private patSelfClosing = /\/\s*$/;
    private patAttrib = new RegExp("([\\w\\-:.]+)\\s*=\\s*([\"'])([^\\2]*?)\\2", "g");
    private patPINode = /^\s*\?\s*([\w\-:]+)\s*(.*)$/;
    private patNextClose = /([^>]*?)>/g;

    private patCommentTag = /^\s*!--/;
    private patEndComment = /--$/;

    private patDTDTag = /^\s*!DOCTYPE/;
    private patInlineDTDNode = /^\s*!DOCTYPE\s+([\w\-:]+)/;

    private patCDATATag = /^\s*!\s*\[\s*CDATA/;
    private patEndCDATA = /]]$/;
    private patCDATANode = /^\s*!\s*\[\s*CDATA\s*\[([^]*)]]/;

    private static getError(error:IParseError):string {
        // get formatted error
        let text:string = '';
        if (!error) return '';

        text = 'Error';
        if (error.code) text += ' ' + error.code;
        text += ': ' + error.key;

        if (error.line) text += ' on line ' + error.line;
        if (error.text) text += ': ' + error.text;

        return text;
    }

    public getTree():XmlNode {
        return this.tree;
    }

    public asString():string {
        return this.stringifyNode(this.tree,1);
    }

    private stringifyNode(node:XmlNode|IXmlTextNode, deepness:number):string {
        const intend:string = new Array(deepness).fill('').join('    ');
        if ((node as IXmlTextNode).data!==undefined) return `${intend}${XmlUtils.encodeEntities((node as IXmlTextNode).data)}`;
        else {
            const n:XmlNode = node as XmlNode;
            let result:string = '';
            if (n.children.length===0) return `${intend}<${n.tagName}${this.stringifyAttributes(n.attributes)}/>`;
            result+=`${intend}<${n.tagName}${this.stringifyAttributes(n.attributes)}>\n`;
            deepness++;
            for (const c of n.children) {
                result+=this.stringifyNode(c,deepness)+'\n';
            }
            result+=`${intend}</${n.tagName}>`;
            return result;
        }
    }

    private stringifyAttributes(attr:Record<string, string>):string {
        let res:string = '';
        Object.keys(attr).forEach(key=>{
           res+=` ${key}="${attr[key]}"`;
        });
        return res;
    }

    private parse(branch?:XmlNode, name?:string):void {
        // parse text into XmlParser tree, recurse for nested nodes
        if (!branch) branch = this.tree;
        if (!name) name = '';
        branch.tagName = name;
        let foundClosing:boolean = false;
        let matches:RegExpMatchArray|null = null;

        // match each tag, plus preceding text
        while ( matches = this.patTag.exec(this.text) ) {
            const before = matches[1];
            let tag = matches[2];

            // text leading up to tag = content of parent node
            if (before.match(/\S/)) {
                const textNode:IXmlTextNode = {
                    data: !this.preserveWhitespace ? XmlUtils.trim(XmlUtils.decodeEntities(before)) : XmlUtils.decodeEntities(before)
                };
                branch.children.push(textNode);
            }

            // parse based on tag type
            if (tag.match(this.patSpecialTag)) {
                // special tag
                if (tag.match(this.patPITag)) tag = this.parsePINode(tag);
                else if (tag.match(this.patCommentTag)) tag = this.parseCommentNode(tag);
                else if (tag.match(this.patDTDTag)) tag = this.parseDTDNode(tag);
                else if (tag.match(this.patCDATATag)) {
                    tag = this.parseCDATANode(tag);
                    const textNode:IXmlTextNode = {
                        data: !this.preserveWhitespace ? XmlUtils.trim(XmlUtils.decodeEntities(tag)) : XmlUtils.decodeEntities(tag)
                    };
                    branch.children.push(textNode);
                } // cdata
                else {
                    this.throwParseError( "Malformed special tag", tag );
                    break;
                } // error

                if (tag == null) break;
            } // special tag
            else {
                // Tag is standard, so parse name and attributes (if any)
                matches = tag.match(this.patStandardTag);
                if (!matches) {
                    this.throwParseError( "Malformed tag", tag );
                }

                const closing = matches[1];
                const nodeName = this.lowerCase ? matches[2].toLowerCase() : matches[2];
                const attribsRaw = matches[3];

                // If this is a closing tag, make sure it matches its opening tag
                if (closing) {
                    if (nodeName === (name || '')) {
                        foundClosing = true;
                        break;
                    }
                    else {
                        this.throwParseError( "Mismatched closing tag (expected </" + name + ">)", tag );
                    }
                } // closing tag
                else {
                    // Not a closing tag, so parse attributes into hash.  If tag
                    // is self-closing, no recursive parsing is needed.
                    const selfClosing:boolean = !!attribsRaw.match(this.patSelfClosing);
                    const leaf:XmlNode = new XmlNode();
                    leaf.tagName = nodeName;

                    // parse attributes
                    this.patAttrib.lastIndex = 0;
                    while ( matches = this.patAttrib.exec(attribsRaw) ) {
                        const key:string = this.lowerCase ? matches[1].toLowerCase() : matches[1];
                        leaf.attributes[key] = XmlUtils.decodeEntities( matches[3] );
                    } // foreach attrib

                    // Recurse for nested nodes
                    if (!selfClosing) {
                        this.parse(leaf, nodeName);
                        if (this.error()) break;
                    }

                    // Add leaf to parent branch
                    branch.children.push(leaf);

                    if (this.error() || (branch === this.tree)) break;
                } // not closing
            } // standard tag
        } // main reg exp

        // Make sure we found the closing tag
        if (name && !foundClosing) {
            this.throwParseError( "Missing closing tag (expected </" + name + ">)", name );
        }

    }

    private afterParsed():void {
        this.tree = this.tree.children[0] as XmlNode;
    }

    private throwParseError(key:string, tag:string):never {
        // log error and locate current line number in source XmlParser document
        const parsedSource:string = this.text.substring(0, this.patTag.lastIndex);
        const eolMatch:RegExpMatchArray|null = parsedSource.match(/\n/g);
        let lineNum:number = (eolMatch ? eolMatch.length : 0) + 1;
        lineNum -= tag.match(/\n/) ? tag.match(/\n/g)!.length : 0;

        this.errors.push({
            key,
            text: `<${tag}>`,
            line: lineNum
        });

        // Throw actual error (must wrap parse in try/catch)
        throw new Error( this.getLastError() );
    }

    private error():number {
        // return number of errors
        return this.errors.length;
    }

    private getLastError():string {
        // Get most recently thrown error in plain text format
        if (!this.error()) return '';
        return XmlParser.getError( this.errors[this.errors.length - 1] );
    }

    private parsePINode(tag:string):string {
        // Parse Processor Instruction Node, e.g. <?xml version="1.0"?>
        if (!tag.match(this.patPINode)) {
            this.throwParseError( "Malformed processor instruction", tag );
        }
        return tag;
    }

    private parseCommentNode(tag:string):string {
        // Parse Comment Node, e.g. <!-- hello -->
        let matches:RegExpMatchArray|null = null;
        this.patNextClose.lastIndex = this.patTag.lastIndex;

        while (!tag.match(this.patEndComment)) {
            matches = this.patNextClose.exec(this.text);
            if (matches) {
                tag += '>' + matches[1];
            }
            else {
                this.throwParseError( "Unclosed comment tag", tag );
            }
        }

        this.patTag.lastIndex = this.patNextClose.lastIndex;
        return tag;
    }

    private parseDTDNode(tag:string):string {
        // Parse Document Type Descriptor Node, e.g. <!DOCTYPE ... >
        //let matches:RegExpExecArray | null = null;
        if (tag.match(this.patInlineDTDNode)) {
            //console.log('match');
            // Tag is inline, so check for nested nodes.
            this.patNextClose.lastIndex = this.patTag.lastIndex;

            if (tag.indexOf('[')>-1) {
                let matches = null;
                while (!tag.match(/]/)) {
                    matches = this.patNextClose.exec(this.text);
                    if (matches) {
                        tag += '>' + matches[1];
                    }
                    else {
                        this.throwParseError( "Unclosed DTD tag", tag );
                    }
                }
                this.patTag.lastIndex = this.patNextClose.lastIndex;
            }

        }
        else {
            this.throwParseError( "Malformed DTD tag", tag );
        }

        return tag;
    }

    private parseCDATANode(tag:string):string {
        // Parse CDATA Node, e.g. <![CDATA[Brooks & Shields]]>
        let matches:RegExpMatchArray | null = null;
        this.patNextClose.lastIndex = this.patTag.lastIndex;

        while (!tag.match(this.patEndCDATA)) {
            matches = this.patNextClose.exec(this.text);
            if (matches) {
                tag += '>' + matches[1];
            }
            else {
                this.throwParseError( "Unclosed CDATA tag", tag );
            }
        }

        this.patTag.lastIndex = this.patNextClose.lastIndex;
        matches = tag.match(this.patCDATANode);
        if (matches) {
            return matches[1];
        }
        else {
            this.throwParseError( "Malformed CDATA tag", tag );
        }
    }

}

namespace XmlUtils {
    export const trim = (text:string):string=> {
        // strip whitespace from beginning and end of string
        if (!text) return '';
        text = text.replace(/^\s+/, "");
        text = text.replace(/\s+$/, "");
        return text;
    };

    export const encodeEntities = (text:string):string=> {
        if (!text) return '';
        text = text.replace(/&/g, "&amp;"); // MUST BE FIRST
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");
        return text;
    };

    export const decodeEntities = (text:string):string=> {
        if (!text) return '';
        if (text.match(/&/)) {
            text = text.replace(/&lt;/g, "<");
            text = text.replace(/&gt;/g, ">");
            text = text.replace(/&quot;/g, '"');
            text = text.replace(/&apos;/g, "'");
            text = text.replace(/&amp;/g, "&"); // MUST BE LAST
        }
        return text;
    };
}

if (typeof exports!=='undefined') {
    exports.XmlParser = XmlParser;
}



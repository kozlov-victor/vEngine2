import {IXmlTextNode, XmlDocument, XmlNode} from "@engine/misc/parsers/xml/xmlElements";
import {DebugError} from "@engine/debug/debugError";
import {IParser} from "@engine/misc/parsers/iParser";

interface IParseError {
    key: string;
    text: string;
    line: number;
    code?:string;
}

export class XmlParser implements IParser<XmlNode>{

    constructor(text:string) {
        this.text = text;
        if (this.text.trim()) {
            this.parse();
            this.afterParsed();
        } else {
            if (DEBUG && !text.trim()) throw new DebugError(`can not parse xml: string is empty`);
        }
    }

    private readonly text:string;

    private tree:XmlNode = new XmlNode();
    private doc:XmlDocument;
    private errors:IParseError[] = [];

    private preserveWhitespace = false;
    private lowerCase = false;

    private expTag = /([^<]*?)<([^>]+)>/g;
    private expSpecialTag = /^\s*([!?])/;
    private expPITag = /^\s*\?/;
    private expStandardTag = /^\s*(\/?)([\w\-:.]+)\s*([\s\S]*)$/;
    private expSelfClosing = /\/\s*$/;
    private expAttrib = new RegExp("([\\w\\-:.]+)\\s*=\\s*([\"'])([^\\2]*?)\\2", "g");
    private expPINode = /^\s*\?\s*([\w\-:]+)\s*(.*)$/;
    private expNextClose = /([^>]*?)>/g;

    private expCommentTag = /^\s*!--/;
    private expEndComment = /--$/;

    private expDTDTag = /^\s*!DOCTYPE/;
    private expInlineDTDNode = /^\s*!DOCTYPE\s+([\w\-:]+)/;

    private expCDATATag = /^\s*!\s*\[\s*CDATA/;
    private expEndCDATA = /]]$/;
    private expCDATANode = /^\s*!\s*\[\s*CDATA\s*\[([^]*)]]/;

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

    public getTree():XmlDocument {
        return this.doc;
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
        // eslint-disable-next-line @typescript-eslint/ban-types
        let matches:RegExpMatchArray|null = null;

        // match each tag, plus preceding text
        while ( matches = this.expTag.exec(this.text) ) {
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
            if (tag.match(this.expSpecialTag)) {
                // special tag
                if (tag.match(this.expPITag)) tag = this.parsePINode(tag);
                else if (tag.match(this.expCommentTag)) tag = this.parseCommentNode(tag);
                else if (tag.match(this.expDTDTag)) tag = this.parseDTDNode(tag);
                else if (tag.match(this.expCDATATag)) {
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
                matches = tag.match(this.expStandardTag);
                if (!matches) {
                    this.throwParseError( "Malformed tag", tag );
                }

                const closing = matches?.[1];
                const nodeName = this.lowerCase ? matches?.[2].toLowerCase() : matches?.[2];
                const attribsRaw = matches?.[3];

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
                    const selfClosing:boolean = !!attribsRaw.match(this.expSelfClosing);
                    const leaf:XmlNode = new XmlNode();
                    leaf.tagName = nodeName;
                    leaf.parent = branch;

                    // parse attributes
                    this.expAttrib.lastIndex = 0;
                    while ( matches = this.expAttrib.exec(attribsRaw) ) {
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
        const root = this.tree.children[0] as XmlNode;
        this.doc = XmlDocument.create(root);
    }

    private throwParseError(key:string, tag:string):never {
        // log error and locate current line number in source XmlParser document
        const parsedSource:string = this.text.substring(0, this.expTag.lastIndex);
        // eslint-disable-next-line @typescript-eslint/ban-types
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
        if (!tag.match(this.expPINode)) {
            this.throwParseError( "Malformed processor instruction", tag );
        }
        return tag;
    }

    private parseCommentNode(tag:string):string {
        // Parse Comment Node, e.g. <!-- hello -->
        // eslint-disable-next-line @typescript-eslint/ban-types
        let matches:RegExpMatchArray|null = null;
        this.expNextClose.lastIndex = this.expTag.lastIndex;

        while (!tag.match(this.expEndComment)) {
            matches = this.expNextClose.exec(this.text);
            if (matches) {
                tag += '>' + matches[1];
            }
            else {
                this.throwParseError( "Unclosed comment tag", tag );
            }
        }

        this.expTag.lastIndex = this.expNextClose.lastIndex;
        return tag;
    }

    private parseDTDNode(tag:string):string {
        // Parse Document Type Descriptor Node, e.g. <!DOCTYPE ... >
        //let matches:RegExpExecArray | null = null;
        if (tag.match(this.expInlineDTDNode)) {
            //console.log('match');
            // Tag is inline, so check for nested nodes.
            this.expNextClose.lastIndex = this.expTag.lastIndex;

            if (tag.indexOf('[')>-1) {
                let matches = null;
                while (!tag.match(/]/)) {
                    matches = this.expNextClose.exec(this.text);
                    if (matches) {
                        tag += '>' + matches[1];
                    }
                    else {
                        this.throwParseError( "Unclosed DTD tag", tag );
                    }
                }
                this.expTag.lastIndex = this.expNextClose.lastIndex;
            }

        }
        else {
            this.throwParseError( "Malformed DTD tag", tag );
        }

        return tag;
    }

    private parseCDATANode(tag:string):string {
        // Parse CDATA Node, e.g. <![CDATA[Brooks & Shields]]>
        // eslint-disable-next-line @typescript-eslint/ban-types
        let matches:RegExpMatchArray | null = null;
        this.expNextClose.lastIndex = this.expTag.lastIndex;

        while (!tag.match(this.expEndCDATA)) {
            matches = this.expNextClose.exec(this.text);
            if (matches) {
                tag += '>' + matches[1];
            }
            else {
                this.throwParseError( "Unclosed CDATA tag", tag );
            }
        }

        this.expTag.lastIndex = this.expNextClose.lastIndex;
        matches = tag.match(this.expCDATANode);
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



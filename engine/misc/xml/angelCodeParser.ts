
// http://www.angelcode.com/products/bmfont/
// http://www.angelcode.com/products/bmfont/doc/file_format.html

import {IXmlNode, XmlNode} from "@engine/misc/xml/xmlELements";
import {IParser} from "@engine/misc/xml/iParser";

export class AngelCodeParser implements IParser {

    constructor(private source:string) {
    }

    private parseToNode(str:string):XmlNode {
        const tags = str.split(' ').map(it=>it.trim()).filter(it=>it.length);
        const tagName = tags.shift();
        const element = new XmlNode();
        element.tagName = tagName!;
        tags.forEach(it=>{
            const pair = it.split('=');
            const key = pair[0].trim();
            let value = pair[1];
            if (value) {
                value = value.trim();
                const firstSymbol = value[0];
                if (['"',"'"].indexOf(firstSymbol)===0) {
                    value = value.substr(1,value.length-2);
                }
            }
            element.attributes[key] = value;
        });
        return element;
    }

    public getTree():IXmlNode{
        const document = new XmlNode();
        this.source.split('\n').forEach(row=>{
            document.children.push(this.parseToNode(row));
        });
        return document;
    }

}

if (typeof exports!=='undefined') {
    exports.AngelCodeParser = AngelCodeParser;
}


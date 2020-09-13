import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Optional} from "@engine/core/declarations";
import {StringEx} from "@engine/renderable/impl/ui/textField/_internal/stringEx";

interface ITextFragment {
    italic?: boolean;
    bold?: boolean;
    color?: IColor|false;
    text?: string;
    linedThrough?: boolean;
    underlined? :boolean;
}

export class RichTextField extends ScrollableTextField {

    public setRichText(node:VirtualNode):void{
        const fragments:ITextFragment[] = [];
        this.traverseNode(node,fragments);
        this._textEx = this.textFragmentToStringEx(fragments);
        this.markAsDirty();
    }

    public getText(): string {
        if (this._textEx===undefined) return super.getText();
        else return this._textEx.asRaw();
    }

    private traverseNode(node:VirtualNode,fragments:ITextFragment[]):void {
        let color:Optional<IColor>;
        if (node.tagName==='font') {
            if (node.props.color!==undefined) {
                color = node.props.color;
            }
        }
        fragments.push({
            text: node.text,
            italic: node.tagName==='i'?true:undefined,
            bold: node.tagName==='b'?true:undefined,
            underlined: node.tagName==='u'?true:undefined,
            linedThrough: node.tagName==='s'?true:undefined,
            color,
        });
        if (node.children) node.children.forEach(c=>{
            this.traverseNode(c,fragments);
        });
        fragments.push({
            text: undefined,
            italic: node.tagName==='i'?false:undefined,
            bold: node.tagName==='b'?false:undefined,
            underlined: node.tagName==='u'?false:undefined,
            linedThrough: node.tagName==='s'?false:undefined,
            color:color!==undefined?false:undefined,
        });
    }

    private textFragmentToStringEx(fragments:ITextFragment[]):StringEx{
        const colorStack:IColor[] = [];
        const result:StringEx = StringEx.fromRaw("");
        let isBold:boolean = false;
        let isItalic:boolean = false;
        let isUnderlined:boolean = false;
        let isLinedThrough:boolean = false;
        let currColor:IColor|undefined;
        fragments.forEach(f=>{
            if (f.bold!==undefined) isBold = f.bold;
            if (f.italic!==undefined) isItalic = f.italic;
            if (f.underlined!==undefined) isUnderlined = f.underlined;
            if (f.linedThrough!==undefined) isLinedThrough = f.linedThrough;
            if (f.color!==undefined) {
                if ((f.color as IColor).r!==undefined) {
                    currColor = f.color as IColor;
                    colorStack.push(f.color as IColor);
                }
                else if (f.color===false) {
                    colorStack.pop();
                    currColor = colorStack[colorStack.length-1];
                }
            }
            if (f.text!==undefined) {
                const prefix:string = (result.getAllChars()[result.getAllChars().length-1]?.rawChar===' ')?'':' '
                const s:StringEx = StringEx.fromRaw(prefix+f.text);
                s.setBold(isBold);
                s.setItalic(isItalic);
                s.setUnderlined(isUnderlined);
                s.setLinedThrough(isLinedThrough);
                if (currColor!==undefined) s.setColor(currColor);
                result.append(s);
            }
        });
        return result;
    }

}

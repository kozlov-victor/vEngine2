import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Optional} from "@engine/core/declarations";
import {StringEx} from "@engine/renderable/impl/ui/textField/_internal/characterUtil";

interface ITextFragment {
    italic?: boolean;
    bold?: boolean;
    color?: IColor|false;
    text?: string;
}

export class RichTextField extends ScrollableTextField {

    private currStr:StringEx;

    public setRichText(node:VirtualNode):void{
        const fragments:ITextFragment[] = [];
        this.traverseNode(node,fragments);
        this.currStr = this.textFragmentToStringEx(fragments);
        this.markAsDirty();
    }

    public getText(): string {
        if (this.currStr===undefined) return "";
        return this.currStr.asRaw();
    }

    protected _setText():void {
        this.rowSet.setFont(this.font);
        this.rowSet.setWordBrake(this.wordBrake);
        if (this.currStr!==undefined) this.rowSet.setTextFromStringEx(this.currStr);
        else this.rowSet.setText(this.getText());
        this.rowSet.setAlignText(this.alignText);
        this.rowSet.setAlignTextContentHorizontal(this.alignTextContentHorizontal);
        this.rowSet.setAlignTextContentVertical(this.alignTextContentVertical);
        this.requestTextRedraw();
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
            color,
        });
        if (node.children) node.children.forEach(c=>{
            this.traverseNode(c,fragments);
        });
        fragments.push({
            text: undefined,
            italic: node.tagName==='i'?false:undefined,
            bold: node.tagName==='b'?false:undefined,
            color:color!==undefined?false:undefined,
        });
    }

    private textFragmentToStringEx(fragments:ITextFragment[]):StringEx{
        const colorStack:IColor[] = [];
        const result:StringEx = StringEx.fromRaw("");
        let isBold:boolean = false;
        let isItalic:boolean = false;
        let currColor:IColor|undefined;
        fragments.forEach(f=>{
            if (f.bold!==undefined) isBold = f.bold;
            if (f.italic!==undefined) isItalic = f.italic;
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
                const s:StringEx = StringEx.fromRaw(' '+f.text);
                s.setBold(isBold);
                s.setItalic(isItalic);
                if (currColor!==undefined) s.setColor(currColor);
                result.concat(s);
            }
        });
        return result;
    }

}

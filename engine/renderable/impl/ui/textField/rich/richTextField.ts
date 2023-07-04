import {VirtualNode} from "@engine/renderable/tsx/_genetic/virtualNode";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Optional} from "@engine/core/declarations";
import {StringEx} from "@engine/renderable/impl/ui/textField/_internal/stringEx";
import {Font} from "@engine/renderable/impl/general/font/font";

interface ITextFragment {
    italic?: boolean;
    bold?: boolean;
    color?: IColor|false;
    specialChar?: 'BREAK';
    text?: string;
    linedThrough?: boolean;
    underlined? :boolean;
    fontSize? : number|false;
    font?:Font|false;
}

export class RichTextField extends ScrollableTextField {

    public override readonly type:string = 'RichTextField';

    public setRichText(node:VirtualNode|JSX.Element):void{
        const fragments:ITextFragment[] = [];
        this.traverseNode(node as VirtualNode,fragments);
        this._textEx = this.textFragmentToStringEx(fragments);
        this.markAsDirty();
    }

    public setStringEx(str:StringEx):void {
        this._textEx = str;
        this.markAsDirty();
    }

    public override getText(): string {
        if (this._textEx===undefined) return super.getText();
        else return this._textEx.asString();
    }

    public override setProps(props:ITextFieldProps & {richText?:INode}):void {
        super.setProps(props);
        if (props.richText!==undefined) this.setRichText(props.richText as VirtualNode);
    }

    private traverseNode(node:VirtualNode,fragments:ITextFragment[]):void {
        let color:Optional<IColor>;
        let fontSize:Optional<number>;
        let font:Optional<Font>;
        if (node.tagName==='v_font') {
            if (node.props.color!==undefined) {
                color = node.props.color;
            }
            if (node.props.size!==undefined) {
                fontSize = node.props.size;
            }
            if (node.props.font!==undefined) {
                font = node.props.font;
            }
        }
        fragments.push({
            text: node.text,
            italic: node.tagName==='i'?true:undefined,
            bold: node.tagName==='b'?true:undefined,
            underlined: node.tagName==='u'?true:undefined,
            linedThrough: node.tagName==='s'?true:undefined,
            color, fontSize, font
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
            fontSize:fontSize!==undefined?false:undefined,
            font:font!==undefined?false:undefined,
        });
    }

    private textFragmentToStringEx(fragments:ITextFragment[]):StringEx{
        const colorStack:IColor[] = [];
        const fontSizeStack:number[] = [];
        const fontStack:Font[] = [];
        const result:StringEx = StringEx.fromRaw("");
        let isBold:boolean = false;
        let isItalic:boolean = false;
        let isUnderlined:boolean = false;
        let isLinedThrough:boolean = false;
        let currColor:IColor|undefined;
        let currFontSize:number|undefined;
        let currFont:Font|undefined;
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
            if (f.fontSize!==undefined) {
                if ((f.fontSize as number).toFixed!==undefined) {
                    currFontSize = f.fontSize = f.fontSize as number;
                    fontSizeStack.push(f.fontSize as number);
                }
                else if (f.fontSize===false) {
                    fontSizeStack.pop();
                    currFontSize = fontSizeStack[fontSizeStack.length-1];
                }
            }
            if (f.font!==undefined) {
                if ((f.font as Font).type!==undefined) {
                    currFont = f.font as Font;
                    fontStack.push(currFont);
                } else if (f.font===false) {
                    fontStack.pop();
                    currFont = fontStack[fontStack.length-1];
                }
            }
            if (f.text!==undefined) {
                const s:StringEx = StringEx.fromRaw(f.text);
                s.setBold(isBold);
                s.setItalic(isItalic);
                s.setUnderlined(isUnderlined);
                s.setLinedThrough(isLinedThrough);
                if (currFont!==undefined) s.setFont(currFont);
                if (currFontSize!==undefined) {
                    s.setFontSize(currFontSize);
                    const fnt:Font = currFont ?? this.font;
                    s.setScaleFromCurrFontSize(currFontSize/fnt.getSize());
                }
                if (currColor!==undefined) s.setColor(currColor);
                result.append(s);
            }
        });
        return result;
    }

}

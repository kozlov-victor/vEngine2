import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {Font, IRectViewJSON} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";
import {Color} from "@engine/renderer/common/color";
import {ICharacterInfo} from "@engine/renderable/impl/ui/textField/_internal/stringEx";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

export class CharacterImage extends Image {

    private colorCloned:boolean = false;
    private textDecoratorLine:Rectangle;

    constructor(game:Game,private font:Font,private characterInfo:ICharacterInfo,color:Color) {
        super(game);
        this.stretchMode = STRETCH_MODE.STRETCH;
        const [padUp,padRight,padDown,padLeft] = font.fontContext.padding;
        let charRect:IRectViewJSON = font.fontContext.symbols[characterInfo.rawChar] || font.fontContext.symbols['?'];
        if (charRect===undefined) {
            const key:string = Object.keys(font.fontContext.symbols)[0];
            if (DEBUG && key===undefined) {
                throw new DebugError(`Bad fontContext has been provided`);
            }
            charRect = font.fontContext.symbols[key];
        }
        if (DEBUG) {
            if (charRect.width===0 || charRect.height===0) {
                console.error(font.fontContext);
                console.error(characterInfo);
                throw new DebugError(`font context error: wrong character rect for symbol "${characterInfo.rawChar}"`);
            }
        }
        this.getSrcRect().setXYWH(
            charRect.x+padLeft,
            charRect.y+padUp,
            charRect.width - padLeft - padRight,
            charRect.height - padUp - padDown
        );
        if (this.getSrcRect().width<=0) this.getSrcRect().width = 0.001;
        if (this.getSrcRect().height<=0) this.getSrcRect().height = 0.001;
        this.setScaleFromCurrFontSize(this.characterInfo.scaleFromCurrFontSize);
        this.pos.setXY(charRect.destOffsetX,charRect.destOffsetY);
        this.setResourceLink(font.getResourceLink());
        this.transformPoint.setToCenter();
        if (!characterInfo.multibyte) this.color = color;
        if (characterInfo.italic) this.setItalic(true);
        if (characterInfo.bold) this.setBold(true);
        if (characterInfo.color) this.setColor(characterInfo.color);
        if (characterInfo.underlined) this.setUnderLined(true);
        if (characterInfo.linedThrough) this.setLinedThrough(true);
        this.updateVisibility();
    }

    public setItalic(val:boolean):void {
        if (val) this.skew.setX(val?-0.2:0);
        this.characterInfo.italic = val;
    }

    public setBold(val:boolean):void {
        const scale:number = val?1.2:1;
        if (val) this.scale.setXY(scale);
        this.characterInfo.bold = val;
    }

    public setColor(color:IColor):void {
        if (this.characterInfo.multibyte) return; // emoji are not colored
        if (!this.colorCloned) {
            this.color = this.color.clone();
            this.colorCloned = true;
        }
        this.color.set(color);
        this.characterInfo.color = color;
        if (this.textDecoratorLine!==undefined) this.textDecoratorLine.color.set(this.color);
    }

    public setUnderLined(val:boolean):void {
        if (val) {
            this.createTextDecoratorLineIfNotExists();
            this.textDecoratorLine.pos.setXY(1,this.size.height - this.textDecoratorLine.size.height);
            this.textDecoratorLine.visible = true;
        } else {
            if (this.textDecoratorLine) this.textDecoratorLine.visible = false;
        }
        this.characterInfo.underlined = val;
        this.updateVisibility();
    }

    public setLinedThrough(val:boolean):void {
        if (val) {
            this.createTextDecoratorLineIfNotExists();
            this.textDecoratorLine.pos.setXY(0,(this.size.height - this.textDecoratorLine.size.height)/2);
            this.textDecoratorLine.visible = true;
        } else {
            if (this.textDecoratorLine) this.textDecoratorLine.visible = false;
        }
        this.characterInfo.linedThrough = val;
        this.updateVisibility();
    }

    public setScaleFromCurrFontSize(scaleFromCurrFontSize:number){
        this.characterInfo.scaleFromCurrFontSize = scaleFromCurrFontSize;
        this.size.setWH(
            this.getSrcRect().width*scaleFromCurrFontSize,
            this.getSrcRect().height*scaleFromCurrFontSize
        );
    }

    private createTextDecoratorLineIfNotExists():void {
        if (this.textDecoratorLine===undefined) {
            const textDecoratorLine = new Rectangle(this.game);
            const height:number = ~~((this.font.fontContext.lineHeight*this.characterInfo.scaleFromCurrFontSize)/12) || 1;
            textDecoratorLine.size.setWH(this.size.width+this.font.fontContext.spacing[0]*2,height);
            textDecoratorLine.lineWidth = 0;
            this.appendChild(textDecoratorLine);
            this.textDecoratorLine = textDecoratorLine;
        }
        this.textDecoratorLine.fillColor.set(this.color);
    }

    private updateVisibility():void {
        this.visible = !(this.characterInfo.rawChar === ' ' && !this.characterInfo.linedThrough && !this.characterInfo.underlined);
    }

}

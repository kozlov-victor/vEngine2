import {FontContextAbstractFactory} from "@engine/renderable/impl/general/font/factory/fontContextAbstractFactory";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {ITexture} from "@engine/renderer/common/texture";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font/font";
import {BinBuffer} from "@engine/misc/parsers/bin/binBuffer";
import {IBdfFont} from "@engine/misc/parsers/bdf/bdfFontParser";

// font collection example https://github.com/Tecate/bitmap-fonts/tree/master/bitmap

interface ILetterInfo {
    data: number[];
    width: number;
    widthExact: number;
    offsetX:number;
    offsetY:number;
}

export class FontContextBdfFactory extends FontContextAbstractFactory<DrawingSurface> {

    private pixelSize:number;

    constructor(game:Game, private bdfFont:IBdfFont) {
        super(game);

    }


    public override createFont(_: readonly string[], __: readonly string[], ___: string, fontSize: number): Font {
        this.pixelSize = fontSize/8;
        if (this.pixelSize<1) this.pixelSize = 1;
        return super.createFont(Object.keys(this.bdfFont.chars), [], '', fontSize);
    }

    protected override createTexturePage(size: ISize): DrawingSurface {
        const tx = new DrawingSurface(this.game,size);
        tx.setPixelPerfect(true);
        tx.setFillColor(Color.BLACK);
        tx.setLineWidth(0);
        return tx;
    }

    protected override texturePageToTexture(page: DrawingSurface): ITexture {
        return page.getTexture();
    }

    protected override drawLetter(context: DrawingSurface, letter: string, x: number, y: number): void {
        const letterInfo = this.bdfFont.chars[letter];
        const data = letterInfo.data;
        let yPoint = 0;
        const pixSize = this.pixelSize;

        context.drawBatch(()=>{
            for (const dataRow of data) {
                for (let i=0;i<8;i++) {
                    const bit = BinBuffer.isBitSet(8-i,dataRow);
                    if (bit) {
                        context.drawRect(
                            x+(i)*pixSize,
                            y+(yPoint+this.bdfFont.fontHeight-data.length)*pixSize,
                            pixSize,pixSize
                        );
                    }
                }
                yPoint++;
            }
        });

    }

    protected override getFontHeight(): number {
        return this.bdfFont.fontHeight * this.pixelSize;
    }

    protected override getLetterWidth(letter: string): number {
        return (this.bdfFont.chars[letter].width-this.bdfFont.chars[letter].offsetX)*this.pixelSize;
    }

    protected getAdvancedWidth(letter: string): number {
        return this.getLetterWidth(letter);
    }

    protected override getDestOffsetX(letter: string): number {
        return -this.bdfFont.chars[letter].offsetX*this.pixelSize;
    }

    protected override getDestOffsetY(letter: string): number {
        return -this.bdfFont.chars[letter].offsetY*this.pixelSize;
    }
}

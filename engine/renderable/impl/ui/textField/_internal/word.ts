import {SimpleGameObjectContainer} from "../../../general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {Font, IFontSymbolInfo} from "@engine/renderable/impl/general/font";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Color} from "@engine/renderer/common/color";
import {ICharacterInfo} from "@engine/renderable/impl/ui/textField/_internal/stringEx";

export class Word extends SimpleGameObjectContainer {

    public declare children: readonly CharacterImage[];
    public readonly rawValue:string;

    private caret:number = 0;

    constructor(
        game:Game,
        private readonly font:Font,
        public readonly chars:Readonly<ICharacterInfo[]>,
        private readonly color:Color,
        private pixelPerfect:boolean
    ) {
        super(game);
        let i:number = 0;
        for (const char of chars) {
            const characterFont:Font = char.font || font;
            const charImage:CharacterImage = new CharacterImage(game,font,char,color);
            charImage.setPixelPerfect(pixelPerfect);
            charImage.pos.setX(this.caret);
            const symbolInfo:IFontSymbolInfo = characterFont.getSymbolInfoByChar(char.rawChar);
            const deltaWidth:number =
                i<chars.length-1?
                    symbolInfo.widthAdvanced+characterFont.context.spacing[0]:
                    charImage.size.width;
            this.caret+=deltaWidth;
            this.appendChild(charImage);
            this.size.width+=deltaWidth;
            i++;
        }
        const maxRawHeight:number = Math.max(...this.children.map(it=>it.size.height),0);
        const maxSpacingVertical:number =
            Math.max(...this.chars.map(it=>it.font?it.font.context.spacing[1]:0),font.context.spacing[1]);
        this.size.height = maxRawHeight + maxSpacingVertical;
        this.rawValue = chars.join('');
    }

    public getMaxCharacterFontScale(): number {
        return Math.max(...this.chars.map(it=>it.scaleFromCurrFontSize)) ?? 1;
    }

}

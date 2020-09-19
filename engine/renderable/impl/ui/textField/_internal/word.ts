import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Color} from "@engine/renderer/common/color";
import {ICharacterInfo} from "@engine/renderable/impl/ui/textField/_internal/stringEx";

export class Word extends NullGameObject {

    public declare children: readonly CharacterImage[];
    public readonly rawValue:string;

    private caret:number = 0;

    constructor(game:Game, private readonly font:Font, public readonly chars:Readonly<ICharacterInfo[]>, private readonly color:Color) {
        super(game);
        chars.forEach(c=>{
            const char:CharacterImage = new CharacterImage(game,font,c,color);
            char.pos.setX(this.caret);
            this.caret+=char.size.width;
            this.appendChild(char);
            this.size.width+=char.size.width;
        });
        this.size.height = Math.max(...this.children.map(it=>it.size.height),0);
        this.rawValue = chars.join('');
    }

    fitSize():void{
        this.size.width = 0;
        this.children.forEach(c=>{
            this.size.width+=c.size.width;
        });
        this.size.height = Math.max(...this.children.map(it=>it.size.height),0);
    }

    clone():Word {
        return new Word(this.game,this.font,this.chars,this.color);
    }

}

import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {Character} from "@engine/renderable/impl/ui2/textField/internal/character";

export class Word extends NullGameObject {

    public declare children: readonly Character[];

    private caret:number = 0;

    constructor(game:Game,private readonly font:Font,public readonly word:string) {
        super(game);
        word.split('').forEach(c=>{
            const char:Character = new Character(game,font,c);
            char.pos.setX(this.caret);
            this.caret+=char.size.width;
            this.appendChild(char);
            this.size.width+=char.size.width;
        });
        this.size.height = Math.max(...this.children.map(it=>it.size.height));
    }

    clone():Word {
        return new Word(this.game,this.font,this.word);
    }

}

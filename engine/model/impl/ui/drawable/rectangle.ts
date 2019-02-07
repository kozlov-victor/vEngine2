import {Game} from "@engine/core/game";
import {Shape} from "../generic/shape";
import {Cloneable} from "@engine/declarations";

export class Rectangle extends Shape implements Cloneable<Rectangle>{

    borderRadius:number = 0;

    constructor(game: Game) {
        super(game);
        this.width = 16;
        this.height = 16;
        this.lineWidth = 1;
    }


    draw():boolean{
        this.game.getRenderer().drawRectangle(this);
        return true;
    }

    protected setClonedProperties(cloned:Rectangle):void{
        cloned.borderRadius  = this.borderRadius;
        cloned.width = this.width;
        cloned.height = this.height;
        cloned.lineWidth = this.lineWidth;
        super.setClonedProperties(cloned);
    }

    clone():Rectangle{
        const cloned:Rectangle = new Rectangle(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

}
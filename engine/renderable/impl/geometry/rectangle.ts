import {Game} from "@engine/core/game";
import {Shape} from "./abstract/shape";
import {ICloneable} from "@engine/core/declarations";
import {Line} from "@engine/renderable/impl/geometry/line";

export class Rectangle extends Shape implements ICloneable<Rectangle>{

    public readonly type:string = 'Rectangle';
    public borderRadius:number = 0;

    constructor(game: Game) {
        super(game);
        this.size.setWH(16);
        this.lineWidth = 1;
    }

    public draw():boolean{
        this.game.getRenderer().drawRectangle(this);
        return true;
    }

    public clone():Rectangle{
        const cloned:Rectangle = new Rectangle(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    protected setClonedProperties(cloned:Rectangle):void{
        cloned.borderRadius  = this.borderRadius;
        cloned.size.set(this.size);
        cloned.lineWidth = this.lineWidth;
        super.setClonedProperties(cloned);
    }

}
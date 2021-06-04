import {Game} from "@engine/core/game";
import {Shape} from "../../abstract/shape";
import {ICloneable} from "@engine/core/declarations";

export class Rectangle extends Shape implements ICloneable<Rectangle>, IRectangleProps{

    public override readonly type:string = 'Rectangle';
    public borderRadius:number = 0;

    constructor(game: Game) {
        super(game);
        this.size.setWH(16);
        this.lineWidth = 1;
    }

    public draw():void{
        this.game.getRenderer().drawRectangle(this);
    }

    public clone():Rectangle{
        const cloned:Rectangle = new Rectangle(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    public override setProps(props: IRectangleProps): void {
        super.setProps(props);
        if (props.borderRadius!==undefined) this.borderRadius = props.borderRadius;
    }

    protected override setClonedProperties(cloned:Rectangle):void{
        cloned.borderRadius  = this.borderRadius;
        cloned.size.set(this.size);
        cloned.lineWidth = this.lineWidth;
        super.setClonedProperties(cloned);
    }

}

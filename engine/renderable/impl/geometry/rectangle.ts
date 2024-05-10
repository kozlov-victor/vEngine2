import {Game} from "@engine/core/game";
import {Shape} from "../../abstract/shape";
import {ICloneable, Optional} from "@engine/core/declarations";
import {AbstractGradient} from "@engine/renderable/impl/fill/abstract/abstractGradient";
import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";

export class Rectangle extends Shape implements ICloneable<Rectangle>, IRectangleProps{

    public override readonly type:string = 'Rectangle';
    public borderRadius:number = 0;
    public fillGradient:Optional<AbstractGradient>;

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

    public override setProps(props: IRectangleProps,parent:IRealNode): void {
        super.setProps(props,parent);
        if (props.borderRadius!==undefined) this.borderRadius = props.borderRadius;
    }

    protected override setClonedProperties(cloned:Rectangle):void{
        cloned.borderRadius  = this.borderRadius;
        cloned.size.setFrom(this.size);
        cloned.lineWidth = this.lineWidth;
        if (this.fillGradient!==undefined) cloned.fillGradient = this.fillGradient.clone();
        super.setClonedProperties(cloned);
    }

}

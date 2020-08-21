import {Ellipse} from "./ellipse";
import {ICloneable} from "@engine/core/declarations";
import {Game} from "@engine/core/game";

export class Circle extends Ellipse implements ICloneable<Circle>, ICircleProps{

    set radius(val:number) {
        if (this._radius===val) return;
        this._radius = val;
        (this as Ellipse).radiusX = (this as Ellipse).radiusY = val;
        this.size.setWH(val*2);
    }

    get radius():number{
        return this._radius;
    }

    public readonly type:'Circle' = 'Circle';

    public radiusX:never;
    public radiusY:never;

    private _radius:number;

    constructor(game:Game){
        super(game);
        this.radius = 10;
    }

    public draw():void{
        this.game.getRenderer().drawEllipse(this);
    }

    public clone():Circle {
        const cloned:Circle = new Circle(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    public setProps(props:ICircleProps):void{
        super.setProps(props);
        if (props.radius!==undefined) this.radius = props.radius;
    }

    protected setClonedProperties(cloned:Circle):void {
        cloned.radius = this.radius;
        super.setClonedProperties(cloned);
    }

}

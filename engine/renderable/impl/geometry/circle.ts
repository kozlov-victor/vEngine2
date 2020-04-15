import {Ellipse} from "./ellipse";
import {ICloneable} from "@engine/core/declarations";
import {Game} from "@engine/core/game";

export class Circle extends Ellipse implements ICloneable<Circle>{

    set radius(val:number) {
        this._radius = val;
        (this as Ellipse).radiusX = (this as Ellipse).radiusY = val;
        this.setWH(val*2);
    }

    get radius():number{
        return this._radius;
    }

    public radiusX:never;
    public radiusY:never;

    public readonly type:'Circle' = 'Circle';
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

    protected setClonedProperties(cloned:Circle):void {
        cloned.radius = this.radius;
        super.setClonedProperties(cloned);
    }

}

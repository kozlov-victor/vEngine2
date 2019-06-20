import {Ellipse} from "./ellipse";
import {ICloneable} from "@engine/declarations";
import {Game} from "@engine/game";

export class Circle extends Ellipse implements ICloneable<Circle>{

    set radius(val:number) {
        this._radius = val;
        this.setWH(val*2);
        this.radiusX = this.radiusY = val;
    }

    get radius():number{
        return this._radius;
    }

    public readonly type:string = 'Circle';
    private _radius: number = 10;

    constructor(game:Game){
        super(game);
    }

    public draw():boolean{
        this.game.getRenderer().drawEllipse(this);
        return true;
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
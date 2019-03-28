import {Ellipse} from "./ellipse";
import {Cloneable} from "@engine/declarations";
import {Game} from "@engine/game";

export class Circle extends Ellipse implements Cloneable<Circle>{

    readonly type:string = 'Circle';
    private _radius: number = 10;

    constructor(game:Game){
        super(game);
    }

    set radius(val:number){
        this._radius = val;
        this.setWH(val*2);
        this.radiusX = this.radiusY = val;
    }

    get radius():number{
        return this._radius;
    }

    draw():boolean{
        this.game.getRenderer().drawEllipse(this);
        return true;
    }

    protected setClonedProperties(cloned:Circle) {
        cloned.radius = this.radius;
        super.setClonedProperties(cloned);
    }

    clone():Circle {
        const cloned:Circle = new Circle(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

}
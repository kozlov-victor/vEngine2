
import {Ellipse} from "./ellipse";

export class Circle extends Ellipse {

    _radius: number = 10;

    set radius(val:number){
        this._radius = val;
        this.width = this.height = val * 2;
    }

    get radius(){
        return this._radius;
    }

    draw():boolean{
        this.radiusX = this.radiusY = this.radius;
        this.game.getRenderer().drawEllipse(this);
        return true;
    }

}
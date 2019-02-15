
import {Ellipse} from "./ellipse";
import {Cloneable} from "@engine/declarations";

export class Circle extends Ellipse implements Cloneable<Circle>{

    readonly type:string = 'Circle';
    _radius: number = 10;

    set radius(val:number){
        this._radius = val;
        this.width = this.height = val * 2;
        this.radiusX = this.radiusY = val;
    }

    get radius(){
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
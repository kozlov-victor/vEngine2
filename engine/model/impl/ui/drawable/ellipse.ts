

import {Shape} from "../generic/shape";
import {Cloneable} from "@engine/declarations";

export class Ellipse extends Shape implements Cloneable<Ellipse>{

    readonly type:string = 'Ellipse';
    private _radiusX: number = 10;
    private _radiusY: number = 20;


    get radiusX(): number {
        return this._radiusX;
    }

    set radiusX(value: number) {
        this._radiusX = value;
        this.width = value*2;
    }

    get radiusY(): number {
        return this._radiusY;
    }

    set radiusY(value: number) {
        this._radiusY = value;
        this.height = value*2;
    }

    draw():boolean{
        this.game.getRenderer().drawEllipse(this);
        return true;
    }

    protected setClonedProperties(cloned:Ellipse) {
        cloned.radiusX = this.radiusX;
        cloned.radiusY = this.radiusY;
        super.setClonedProperties(cloned);
    }

    update(time:number,delta:number){
        super.update(time,delta);
    }

    clone():Ellipse {
        const cloned:Ellipse = new Ellipse(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

}
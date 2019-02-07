

import {Shape} from "../generic/shape";
import {Cloneable} from "@engine/declarations";

export class Ellipse extends Shape implements Cloneable<Ellipse>{

    radiusX: number = 10;
    radiusY: number = 20;

    draw():boolean{
        this.game.getRenderer().drawEllipse(this);
        return true;
    }

    protected setClonedProperties(cloned:Ellipse) {
        cloned.radiusX = this.radiusX;
        cloned.radiusY = this.radiusY;
        super.setClonedProperties(cloned);
    }

    clone():Ellipse {
        const cloned:Ellipse = new Ellipse(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

}
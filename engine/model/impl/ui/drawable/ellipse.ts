

import {Shape} from "../generic/shape";

export class Ellipse extends Shape {

    radiusX: number = 10;
    radiusY: number = 20;

    draw():boolean{
        this.game.getRenderer().drawEllipse(this);
        return true;
    }

}
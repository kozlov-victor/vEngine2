import {Game} from "@engine/core/game";
import {Shape} from "../generic/shape";

export class Rectangle extends Shape {

    borderRadius:number = 0;

    constructor(game: Game) {
        super(game);
        this.width = 16;
        this.height = 16;
        this.lineWidth = 1;
    }


    draw():boolean{
        this.game.getRenderer().drawRectangle(this);
        return true;
    }

}
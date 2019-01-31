
import {Rectangle} from "./rectangle";
import {Color} from "../../../../core/renderer/color";
import {Game} from "../../../../core/game";

export class Border extends Rectangle {
    constructor(game:Game){
        super(game);
        this.fillColor = Color.NONE;
    }
}
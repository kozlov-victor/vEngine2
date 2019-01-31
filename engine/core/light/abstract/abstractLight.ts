import {DebugError} from "../../../debugError";



import {Game} from "../../game";
import {Color} from "../../renderer/color";

export abstract class AbstractLight {

    public color:Color = Color.WHITE;
    public intensity:number = 1.0;

    protected game:Game;

    protected constructor(game:Game){
        if (DEBUG && !game) throw new DebugError(`game instanse is not passed to AbstractLight constructor`);
        this.game = game;
    }

}

import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";

export class NullGameObject extends RenderableModel { // todo rename to nullContainer

    constructor(public game:Game){
        super(game);
    }

    public draw():void{}

}
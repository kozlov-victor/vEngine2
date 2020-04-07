
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";

export class NullGameObject extends RenderableModel {

    constructor(protected game:Game){
        super(game);
    }

    public draw():void{}

}

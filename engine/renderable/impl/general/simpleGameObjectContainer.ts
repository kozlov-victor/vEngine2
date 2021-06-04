
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";

export class SimpleGameObjectContainer extends RenderableModel {

    constructor(game:Game){
        super(game);
    }

    public draw():void{}
}


import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";

export class SimpleGameObjectContainer extends RenderableModel {

    constructor(protected game:Game){
        super(game);
    }

    public draw():void{}
}

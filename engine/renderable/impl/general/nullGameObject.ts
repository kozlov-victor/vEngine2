import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";

export class NullGameObject extends RenderableModel {

    constructor(public game:Game){
        super(game);
    }

    public draw():boolean{
        return true;
    }

}
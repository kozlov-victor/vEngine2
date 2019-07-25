import {GameObject} from "@engine/model/impl/general/gameObject";
import {RenderableModel} from "@engine/model/abstract/renderableModel";
import {Game} from "@engine/game";

export class NullGameObject extends RenderableModel {

    constructor(public game:Game){
        super(game);
    }

    public draw():boolean{
        return true;
    }

}
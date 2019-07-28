
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Game} from "@engine/core/game";

export class Model3d extends Mesh {

    constructor(protected game:Game) {
        super(game,true,true);
    }

}

import {Mesh} from "@engine/model/abstract/mesh";
import {Game} from "@engine/game";

export class Model3d extends Mesh {

    constructor(protected game:Game) {
        super(game,true,true);
    }

}
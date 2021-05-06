import {Game} from "@engine/core/game";
import {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";

export class Model3d extends Mesh3d {

    constructor(protected game:Game) {
        super(game);
        this.invertY = true;
        this.depthTest = true;
    }

}

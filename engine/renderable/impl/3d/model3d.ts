
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Game} from "@engine/core/game";
import {Point3d} from "@engine/geometry/point3d";

export class Model3d extends Mesh {

    constructor(protected game:Game) {
        super(game);
        this.invertY = true;
        this.depthTest = true;
    }

}


import {Mesh} from "@engine/renderable/abstract/mesh";
import {Game} from "@engine/core/game";
import {Point3d} from "@engine/geometry/point3d";

export class Model3d extends Mesh {

    public scale:Point3d = new Point3d(1,1,1);

    constructor(protected game:Game) {
        super(game,true);
        this.depthTest = true;
    }

}

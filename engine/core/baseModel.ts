import {Size} from "@engine/geometry/size";
import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {Point3d} from "@engine/geometry/point3d";

export abstract class BaseModel {

    public readonly size = new Size();
    public readonly type:string;
    public readonly pos = new Point3d(0,0,0);

    protected constructor(protected game:Game){
        if (DEBUG && !game) throw new DebugError(
            `can not create model '${this.type}': game instance is not passed to model constructor`
        );
    }

}

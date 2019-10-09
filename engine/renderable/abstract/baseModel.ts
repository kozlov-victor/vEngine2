import {Size} from "@engine/geometry/size";
import {Game} from "@engine/core/game";
import {Point2d} from "@engine/geometry/point2d";
import {DebugError} from "@engine/debug/debugError";

export abstract class BaseModel {

    public readonly size:Size = new Size();
    public readonly type:string;
    public readonly pos:Point2d = new Point2d(0,0);
    public posZ:number = 0;

    protected constructor(protected game:Game){
        if (DEBUG && !game) throw new DebugError(
            `can not create model '${this.type}': game instance not passed to model constructor`
        );
    }

}
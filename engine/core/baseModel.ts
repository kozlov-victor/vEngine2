import {Size} from "@engine/geometry/size";
import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {Point3d} from "@engine/geometry/point3d";
import {IRect, Rect} from "@engine/geometry/rect";

export abstract class BaseModel {

    public readonly size = new Size();
    public readonly type:string;
    public readonly pos = new Point3d(0,0,0);

    private _destRect = new Rect();
    private _dirtyDestRect = true;

    protected constructor(protected game:Game){
        if (DEBUG && !game) throw new DebugError(
            `can not create model '${this.type}': game instance is not passed to model constructor`
        );
        this.pos.observe(()=>this._dirtyDestRect = true);
        this.size.observe(()=>this._dirtyDestRect = true);
    }

    public getDestRect(): IRect {
        if (this._dirtyDestRect) {
            this._destRect.setXYWH(this.pos.x,this.pos.y,this.size.width,this.size.height);
            this._dirtyDestRect = false;
        }
        return this._destRect;
    }

}

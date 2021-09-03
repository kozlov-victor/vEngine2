import {DebugError} from "@engine/debug/debugError";

export abstract class AbstractBuffer {
    private _destroyed:boolean = false;

    protected checkDestroyed():void {
        if (DEBUG && this._destroyed) throw new DebugError("can not bind VertexBuffer, it is already destroyed");
    }

    protected destroy():void {
        this._destroyed = true;
    }

}

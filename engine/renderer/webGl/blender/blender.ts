import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {Optional} from "@engine/core/declarations";

export class Blender {

    private _lastMode:Optional<BLEND_MODE>;
    private _enabled:Optional<boolean>;

    constructor(private gl:WebGLRenderingContext){}

    public enable():void{
        if (this._enabled) return;
        this._enabled = true;
        this.gl.enable(this.gl.BLEND);
    }

    public disable():void{
        if (this._enabled===false) return;
        this._enabled = false;
        this.gl.disable(this.gl.BLEND);
    }

    public setBlendMode(blendMode:BLEND_MODE):void {
        if (blendMode===this._lastMode) return;
        this._lastMode = blendMode;
        const gl:WebGLRenderingContext = this.gl;
        switch (blendMode) {
            case BLEND_MODE.NORMAL:
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
                break;
            case BLEND_MODE.ADDITIVE:
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ONE,gl.ONE);
                break;
            case BLEND_MODE.SUBSTRACTIVE:
                gl.blendEquation(gl.FUNC_SUBTRACT);
                gl.blendFunc(gl.ONE,gl.ONE);
                break;
            case BLEND_MODE.REVERSE_SUBSTRACTIVE:
                gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
                gl.blendFunc(gl.ONE,gl.ONE);
                break;
            default:
                if (DEBUG) {
                    throw new DebugError(`unknown blend mode: ${blendMode}`);
                }
                break;
        }
    }

}
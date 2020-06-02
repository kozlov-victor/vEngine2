import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {Optional} from "@engine/core/declarations";

export class Blender {

    public static getSingleton(gl:WebGLRenderingContext):Blender{
        if (Blender.instance===undefined) Blender.instance = new Blender(gl);
        return Blender.instance;
    }

    private static instance:Blender;

    private _lastMode:Optional<BLEND_MODE>;
    private _enabled:Optional<boolean>;

    private constructor(private readonly _gl:WebGLRenderingContext){}

    public enable():void{
        if (this._enabled) return;
        this._enabled = true;
        this._gl.enable(this._gl.BLEND);
    }

    public disable():void{
        if (this._enabled===false) return;
        this._enabled = false;
        this._gl.disable(this._gl.BLEND);
    }

    public setBlendMode(blendMode:BLEND_MODE):void {
        if (blendMode===this._lastMode) return;
        this._lastMode = blendMode;
        const gl:WebGLRenderingContext = this._gl;
        switch (blendMode) {
            case BLEND_MODE.NORMAL:
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
                break;
            case BLEND_MODE.NORMAL_SEPARATE:
                gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
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

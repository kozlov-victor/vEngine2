import {BLEND_MODE} from "@engine/model/renderableModel";
import {DebugError} from "@engine/debug/debugError";

export class Blender {

    constructor(private gl:WebGLRenderingContext){}

    public enable():void{
        this.gl.enable(this.gl.BLEND);
    }

    public disable():void{
        this.gl.disable(this.gl.BLEND);
    }

    public setBlendMode(blendMode:BLEND_MODE):void {
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
                    throw new DebugError(`unknow blend mode ${blendMode}`);
                }
                break;
        }
    }

}
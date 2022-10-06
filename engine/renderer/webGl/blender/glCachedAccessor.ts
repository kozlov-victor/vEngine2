import {CullFace} from "@engine/renderable/impl/3d/mesh3d";

export class GlCachedAccessor {

    private _depthTest:boolean;
    private cullFace:CullFace;
    private cullFaceEnabled:boolean;

    constructor(private _gl:WebGLRenderingContext) {
    }

    public setDepthTest(val:boolean):void {
        if (this._depthTest===val) return;
        if (val) this._gl.enable(this._gl.DEPTH_TEST);
        else this._gl.disable(this._gl.DEPTH_TEST);
        this._depthTest = val;
    }

    public setCulling(val:boolean):void {
        if (val===this.cullFaceEnabled) return;
        if (val) {
            this._gl.enable(this._gl.CULL_FACE);
        } else {
            this._gl.disable(this._gl.CULL_FACE);
        }
        this.cullFaceEnabled = val;
    }

    public setCullFace(val:CullFace):void {
        if (this.cullFace===val) return;
        if (val===CullFace.front) {
            this.setCulling(true);
            this._gl.cullFace(this._gl.FRONT);
        } else if (val===CullFace.back) {
            this.setCulling(true);
            this._gl.cullFace(this._gl.BACK);
        }
        else {
            this.setCulling(false);
        }
        this.cullFace = val;
    }

}

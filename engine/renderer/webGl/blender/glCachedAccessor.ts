import {CullFace} from "@engine/renderable/impl/3d/mesh3d";

export class GlCachedAccessor {

    private _depthTest:boolean;
    private _culling:CullFace;

    constructor(private _gl:WebGLRenderingContext) {
    }

    public setDepthTest(val:boolean) {
        if (this._depthTest===val) return;
        if (val) this._gl.enable(this._gl.DEPTH_TEST);
        else this._gl.disable(this._gl.DEPTH_TEST);
        this._depthTest = val;
    }

    public setCullFace(val:CullFace) {
        if (this._culling===val) return;
        if (val===CullFace.front) {
            this._gl.enable(this._gl.CULL_FACE);
            this._gl.cullFace(this._gl.FRONT);
        } else if (val===CullFace.back) {
            this._gl.enable(this._gl.CULL_FACE);
            this._gl.cullFace(this._gl.BACK);
        }
        else this._gl.disable(this._gl.CULL_FACE);
        this._culling = val;
    }

}

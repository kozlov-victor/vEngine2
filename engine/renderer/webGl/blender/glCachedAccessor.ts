
export class GlCachedAccessor {

    private _depthTest:boolean;

    constructor(private _gl:WebGLRenderingContext) {
    }

    public setDepthTest(val:boolean) {
        if (this._depthTest===val) return;
        if (val) this._gl.enable(this._gl.DEPTH_TEST);
        else this._gl.disable(this._gl.DEPTH_TEST);
        this._depthTest = val;
    }

}

import {Optional} from "@engine/core/declarations";
import {ShaderProgram} from "@engine/renderer/webGl/base/shaderProgram";
import {DebugError} from "@engine/debug/debugError";
import {ITexture} from "@engine/renderer/common/texture";
import {Size} from "@engine/geometry/size";

export const isPowerOf2 = (value:number):boolean=> {
    return (value & (value - 1)) === 0;
};

export const enum INTERPOLATION_MODE {
    NEAREST = 0,
    LINEAR = 1,
}

export abstract class AbstractTexture implements ITexture {

    protected constructor(protected readonly gl:WebGLRenderingContext){
        if (DEBUG) {
            if (!gl) throw new DebugError("can not create Texture, gl context not passed to constructor, expected: Texture(gl)");
            // define max texture units supported
            if (!AbstractTexture._MAX_TEXTURE_IMAGE_UNITS) {
                AbstractTexture._MAX_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
                if (DEBUG && !AbstractTexture._MAX_TEXTURE_IMAGE_UNITS) {
                    throw new DebugError(`Can not obtain MAX_TEXTURE_IMAGE_UNITS value`);
                }
            }
        }
        this.tex = gl.createTexture() as WebGLTexture;
        if (DEBUG && !this.tex) throw new DebugError(`can not allocate memory for texture`);
    }

    public static currentBindTextureAt:{[index:number]:AbstractTexture} = {};

    private static _MAX_TEXTURE_IMAGE_UNITS:number = 0;

    private static _instances:AbstractTexture[] = [];

    public readonly size:Size = new Size(0,0);

    protected abstract samplerType:GLenum;

    protected tex:WebGLTexture;
    private _destroyed:boolean = false;

    private _currentTextureAt0:Optional<AbstractTexture>;
    private _interpolationMode:INTERPOLATION_MODE;

    public static destroyAll():void{
        for (let i:number = 0; i<AbstractTexture._instances.length; i++) {
            AbstractTexture._instances[i].destroy();
        }
        AbstractTexture.currentBindTextureAt = {};
    }

    public bind(name:string,i:number,program:ShaderProgram):void { // uniform eq to 0 by default
        if (DEBUG) {
            if (!name) {
                console.error(this);
                throw new DebugError(`can not bind texture: uniform name was not provided`);
            }
            if (i>AbstractTexture._MAX_TEXTURE_IMAGE_UNITS - 1) {
                console.error(this);
                throw new DebugError(`can not bind texture with index ${i}. Max supported value by device is ${AbstractTexture._MAX_TEXTURE_IMAGE_UNITS}`);
            }
            if (this._destroyed) {
                console.error(this);
                throw new DebugError(`can not bind destroyed texture`);
            }
        }
        if (AbstractTexture.currentBindTextureAt[i]===this) return;
        program.setUniform(name,i);
        const gl:WebGLRenderingContext = this.gl;
        gl.activeTexture(gl.TEXTURE0+i);
        gl.bindTexture(this.samplerType, this.tex);
        AbstractTexture.currentBindTextureAt[i] = this;
    }

    public unbind(i:number = 0):void {
        const gl:WebGLRenderingContext = this.gl;
        gl.activeTexture(gl.TEXTURE0+i);
        gl.bindTexture(gl.TEXTURE_2D, null);
        delete AbstractTexture.currentBindTextureAt[i];
    }

    public destroy():void{
        this.gl.deleteTexture(this.tex);
        AbstractTexture._instances.splice(AbstractTexture._instances.indexOf(this),1);
        this._destroyed = true;
    }

    public isDestroyed(): boolean {
        return this._destroyed;
    }

    public getGlTexture():WebGLTexture {
        return this.tex;
    }

    public setInterpolationMode(mode:INTERPOLATION_MODE):void {
        if (mode===this._interpolationMode) return;
        this.beforeOperation();

        const gl:WebGLRenderingContext = this.gl;

        let glMode:number;
        switch (mode) {
            case INTERPOLATION_MODE.LINEAR:
                glMode = gl.LINEAR;
                break;
            case INTERPOLATION_MODE.NEAREST:
                glMode = gl.NEAREST;
                break;
            default:
                if (DEBUG) throw new DebugError(`unknown interpolation mode ${mode}`);
                break;
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glMode!);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glMode!);

        this._interpolationMode = mode;

        this.afterOperation();
    }

    protected beforeOperation():void {
        this._currentTextureAt0 = AbstractTexture.currentBindTextureAt[0];
        this.gl.bindTexture(this.samplerType, this.tex);
    }

    protected afterOperation():void{
        const texAt0 = this._currentTextureAt0;
        if (texAt0!==undefined) {
            this.gl.bindTexture(texAt0.samplerType, texAt0.tex);
        }
        else this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this._currentTextureAt0 = undefined;
    }


    protected setFilters():void{
        const gl:WebGLRenderingContext = this.gl;
        const isPowerOfTwo:boolean = isPowerOf2(this.size.width) && isPowerOf2(this.size.height);
        // Check if the image is a power of 2 in both dimensions.
        if (isPowerOfTwo) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
    }
}

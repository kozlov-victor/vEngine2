import {DebugError} from "@engine/debug/debugError";
import {ISize, Size} from "@engine/geometry/size";
import {ShaderProgram} from "./shaderProgram";
import {ITexture} from "@engine/renderer/common/texture";
import {Optional} from "@engine/core/declarations";

const isPowerOf2 = (value:number):boolean=> {
    return (value & (value - 1)) === 0;
};

export const enum INTERPOLATION_MODE {
    NEAREST = 0,
    LINEAR = 1,
}

export class Texture implements ITexture {

    public static currentBindTextureAt:{[index:number]:Texture} = {};

    public static destroyAll(){
        for (let i:number = Texture.instances.length-1; i <=0; i++) {
            Texture.instances[i].destroy();
        }
        Texture.currentBindTextureAt = {};
    }

    private static MAX_TEXTURE_IMAGE_UNITS:number = 0;

    private static instances:Texture[] = [];
    public readonly size:Size = new Size(0,0);

    protected readonly gl:WebGLRenderingContext;
    private readonly tex:WebGLTexture;
    private interpolationMode:INTERPOLATION_MODE;

    private _currentTextureAt0:Optional<Texture>;
    private destroyed:boolean = false;

    constructor(gl:WebGLRenderingContext){
        if (DEBUG && !gl) throw new DebugError("can not create Texture, gl context not passed to constructor, expected: Texture(gl)");
        this.gl = gl;

        if (DEBUG) {
            // define max texture units supported
            if (!Texture.MAX_TEXTURE_IMAGE_UNITS)
                Texture.MAX_TEXTURE_IMAGE_UNITS =  gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }

        this.tex = gl.createTexture() as WebGLTexture;
        if (DEBUG && !this.tex) throw new DebugError(`can not allocate memory for texture`);
        // Fill the texture with a 1x1 blue pixel.
        this.setRawData(new Uint8Array([0, 255, 0, 255]),1,1);
        Texture.instances.push(this);
    }

    // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); for bitmap textures
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    /**
     * @param img - if image is undefined, width and height must be specified
     * @param size -unused if image specified
     */
    public setImage(
        img:ImageBitmap|ImageData|HTMLVideoElement|HTMLImageElement|HTMLCanvasElement|undefined,
        size:ISize = new Size(0,0)):void{

        const gl:WebGLRenderingContext = this.gl;

        if (DEBUG) {
            if (!(img || size.width || size.height))
                throw new DebugError("texture.setImage: if image is undefined, width and height must be specified: tex.setImage(null,w,h)");

            const maxSupportedSize:number = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
            if (size.width>maxSupportedSize || size.height>maxSupportedSize) {
                throw new DebugError(`can not create texture with size ${size.width}x${size.height}, max supported size is ${maxSupportedSize}`);
            }
        }
        if (img!==undefined) this.size.setWH(img.width,img.height);
        else this.size.set(size);

        this.beforeOperation();

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1); // 1 or true
        if (img) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        } else {
            // tslint:disable-next-line:no-null-keyword
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size.width, size.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        this.setFilters();
        this.setInterpolationMode(INTERPOLATION_MODE.LINEAR);

        this.afterOperation();

    }

    public bind(name:string,i:number,program:ShaderProgram):void { // uniform eq to 0 by default
        if (DEBUG) {
            if (!name) {
                console.error(this);
                throw new DebugError(`can not bind texture: uniform name was not provided`);
            }
            if (i>Texture.MAX_TEXTURE_IMAGE_UNITS - 1) {
                console.error(this);
                throw new DebugError(`can not bind texture with index ${i}. Max supported value by device is ${Texture.MAX_TEXTURE_IMAGE_UNITS}`);
            }
            if (this.destroyed) {
                console.error(this);
                throw new DebugError(`can not bind destroyed texture`);
            }
        }
        program.setUniform(name,i);
        if (Texture.currentBindTextureAt[i]===this) return;
        const gl:WebGLRenderingContext = this.gl;
        gl.activeTexture(gl.TEXTURE0+i);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        Texture.currentBindTextureAt[i] = this;
    }

    public unbind(i:number = 0):void {
        const gl:WebGLRenderingContext = this.gl;
        gl.activeTexture(gl.TEXTURE0+i);
        // tslint:disable-next-line:no-null-keyword
        gl.bindTexture(gl.TEXTURE_2D, null);
        delete Texture.currentBindTextureAt[i];
    }


    public getData():Uint8Array { // todo test!
        const gl:WebGLRenderingContext = this.gl;
        const wxh:number = this.size.width*this.size.height;
        if (DEBUG && gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)
            throw new DebugError(`Texture.GetColorArray() failed!`);
        const pixels:Uint8Array = new Uint8Array(wxh * 4);
        gl.readPixels(0, 0, this.size.width, this.size.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        return pixels;
    }

    // public getDataUrl():string {
    //     const blob = new Blob(this.getData(), 'image/png');
    //     return window.URL.createObjectURL(blob);
    // }


    public destroy():void{
        this.gl.deleteTexture(this.tex);
        Texture.instances.splice(Texture.instances.indexOf(this),1);
        this.destroyed = true;
    }

    public getGlTexture():WebGLTexture {
        return this.tex;
    }

    public setInterpolationMode(mode:INTERPOLATION_MODE) {
        if (mode===this.interpolationMode) return;
        this.beforeOperation();

        const gl:WebGLRenderingContext = this.gl;

        let glMode:Optional<number>;
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
        this.interpolationMode = mode;

        this.afterOperation();
    }


    protected setRawData(data:Uint8Array,width:number,height:number,mode:INTERPOLATION_MODE = INTERPOLATION_MODE.LINEAR){
        if (DEBUG) {
            const numOfBytes:number = width*height*4;
            if (data.length!==numOfBytes) {
                throw new DebugError(`unexpected Uint8Array length, expected width*height*4 (${width}*${height}*4=${numOfBytes}), but is found ${data.length}`);
            }
        }
        const gl:WebGLRenderingContext = this.gl;

        this.beforeOperation();

        this.size.setWH(width,height);

        // target: number,
        // level: number,
        // internalformat: number,
        // width: number,
        // height: number,
        // border: number,
        // format: number,
        // type: number,
        // pixels: ArrayBufferView | null
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        this.setFilters();
        this.setInterpolationMode(mode);

        this.afterOperation();

    }

    protected beforeOperation() {
        if (this._currentTextureAt0!==undefined) return;
        this._currentTextureAt0 = Texture.currentBindTextureAt[0];
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
    }

    protected afterOperation(){
        if (this._currentTextureAt0) this.gl.bindTexture(this.gl.TEXTURE_2D, this._currentTextureAt0.tex);
        // tslint:disable-next-line:no-null-keyword
        else this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this._currentTextureAt0 = undefined;
    }


    private setFilters(){
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



import {DebugError} from "@engine/debug/debugError";
import {Size} from "@engine/geometry/size";
import {ShaderProgram} from "./shaderProgram";

const isPowerOf2 = function(value:number):boolean {
    return (value & (value - 1)) === 0;
};


export class Texture {

    gl:WebGLRenderingContext;
    tex:WebGLTexture = null;
    readonly size:Size = new Size(0,0);

    private static MAX_TEXTURE_IMAGE_UNITS:number = 0;

    static currInstances:{[index:number]:Texture} = {};

    constructor(gl:WebGLRenderingContext){
        if (DEBUG && !gl) throw new DebugError("can not create Texture, gl context not passed to constructor, expected: Texture(gl)");
        this.gl = gl;

        if (DEBUG) {
            // define max texture units supported
            if (!Texture.MAX_TEXTURE_IMAGE_UNITS)
                Texture.MAX_TEXTURE_IMAGE_UNITS =  gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }

        this.tex = gl.createTexture();
        if (DEBUG && !this.tex) throw new DebugError(`can not allocate memory for texture`);
        // Fill the texture with a 1x1 blue pixel.
        this.setRawData(new Uint8Array([0, 255, 0, 255]),1,1);
    }


    private setFilters(){
        const gl:WebGLRenderingContext = this.gl;
        const isPowerOfTwo:boolean = (isPowerOf2(this.size.width) && isPowerOf2(this.size.height));
        // Check if the image is a power of 2 in both dimensions.
        if (isPowerOfTwo) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // NEAREST,LINEAR
        }
    }

    // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); for bitmap textures
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    /**
     * @param img - if image is null, width and height must be specified
     * @param width -unused if image specified
     * @param height -unused if image specified
     */
    setImage(
        img:null|ImageBitmap|ImageData|HTMLVideoElement|HTMLImageElement|HTMLCanvasElement,
        width:number = 0,
        height:number = 0):void{

        const gl:WebGLRenderingContext = this.gl;

        if (DEBUG) {
            if (!(img || width || height))
                throw new DebugError("texture.setImage: if image is null, width and height must be specified: tex.setImage(null,w,h)");

            const maxSupportedSize:number = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
            if (width>maxSupportedSize || height>maxSupportedSize) {
                throw new DebugError(`can not create texture with size ${width}x${height}, max supported size is ${maxSupportedSize}`);
            }
        }
        if (img) this.size.setWH(img.width,img.height);
        else this.size.setWH(width,height);
        //gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1); // 1 or true
        if (img) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        this.setFilters();
        gl.bindTexture(gl.TEXTURE_2D, null);

    }

    setRawData(data:Uint8Array,width:number,height:number){
        if (DEBUG) {
            const numOfBytes:number = width*height*4;
            if (data.length!==numOfBytes) {
                throw new DebugError(`unexpected Uint8Array length, expected width*height*4 (${width}*${height}*4=${numOfBytes}), but is found ${data.length}`);
            }
        }
        const gl:WebGLRenderingContext = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
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
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    bind(name:string,i:number,program:ShaderProgram):void { // uniform eq to 0 by default
        if (DEBUG) {
            if (!name) {
                console.error(this);
                throw new DebugError(`can not bind texture: uniform name was not provided`);
            }
            if (i>Texture.MAX_TEXTURE_IMAGE_UNITS - 1) {
                throw new DebugError(`can not bind texture with index ${i}. Max supported value by device is ${Texture.MAX_TEXTURE_IMAGE_UNITS}`);
            }
        }
        program.setUniform(name,i);
        if (Texture.currInstances[i]===this) return;
        const gl:WebGLRenderingContext = this.gl;
        gl.activeTexture(gl.TEXTURE0+i);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        Texture.currInstances[i] = this;
    }

    unbind(i:number = 0):void {
        const gl:WebGLRenderingContext = this.gl;
        gl.activeTexture(gl.TEXTURE0+i);
        gl.bindTexture(gl.TEXTURE_2D, null);
        delete Texture.currInstances[i];
    }


    getColorArray():Uint8Array {
        const gl:WebGLRenderingContext = this.gl;
        const wxh:number = this.size.width*this.size.height;
        if (DEBUG && gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)
            throw new DebugError(`Texture.GetColorArray() failed!`);
        const pixels:Uint8Array = new Uint8Array(wxh * 4);
        gl.readPixels(0, 0, this.size.width, this.size.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        return pixels;
    }

    destroy():void{
        this.gl.deleteTexture(this.tex);
    }

    getGlTexture():WebGLTexture {
        return this.tex;
    }

}



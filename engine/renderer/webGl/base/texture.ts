import {DebugError} from "@engine/debug/debugError";
import {ISize, Size} from "@engine/geometry/size";
import {AbstractTexture, INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";


export class Texture extends AbstractTexture{


    protected samplerType: GLenum = this.gl.TEXTURE_2D;

    constructor(gl:WebGLRenderingContext){
        super(gl);
        // Fill the texture with a 1x1 blue pixel.
        this.setRawData(new Uint8Array([0, 255, 0, 255]),1,1);
    }

    // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); for bitmap textures
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
            if (DEBUG && !maxSupportedSize) throw new DebugError(`Can not obtain MAX_TEXTURE_SIZE value`);
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


    public toDataArray():Uint8Array {
        const gl:WebGLRenderingContext = this.gl;
        const wxh:number = this.size.width*this.size.height;

        const fb:WebGLFramebuffer = gl.createFramebuffer()!;
        this.beforeOperation();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, this.tex, 0);

        if (DEBUG && gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)
            throw new DebugError(`wrong framebuffer state!`);
        const pixels:Uint8Array = new Uint8Array(wxh * 4);
        gl.readPixels(0, 0, this.size.width, this.size.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        this.afterOperation();
        return pixels;
    }

    public toDataUrl():string {
        const canvas:HTMLCanvasElement = document.createElement('canvas');
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d')!;
        canvas.width = this.size.width;
        canvas.height = this.size.height;
        const imgData:ImageData = ctx.createImageData(this.size.width,this.size.height);
        imgData.data.set(this.toDataArray());
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL();
    }



    protected setRawData(data:Uint8Array,width:number,height:number,mode:INTERPOLATION_MODE = INTERPOLATION_MODE.LINEAR):void{
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


}



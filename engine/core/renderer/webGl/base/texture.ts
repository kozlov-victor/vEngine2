import {DebugError} from "@engine/debugError";




import {FrameBuffer} from "./frameBuffer";
import {AbstractFilter} from "../filters/abstract/abstractFilter";
import {Size} from "../../../geometry/size";
import {ShaderProgram} from "./shaderProgram";
import {TextureInfo} from "../programs/abstract/abstractDrawer";

const isPowerOf2 = function(value:number):boolean {
    return (value & (value - 1)) === 0;
};

// array of two frameBuffer for filters to apply
class TextureFilterBuffer {

    gl:WebGLRenderingContext;
    buffers:[FrameBuffer,FrameBuffer];
    parent:Texture;

    constructor(parent:Texture){
        this.parent = parent;
    }

    instantiate(gl:WebGLRenderingContext){
        this.gl = gl;
        this.buffers = [
            new FrameBuffer(gl,this.parent.size.width,this.parent.size.height),
            new FrameBuffer(gl,this.parent.size.width,this.parent.size.height)
        ];
    }

    flip(){
        let tmp = this.buffers[0];
        this.buffers[0] = this.buffers[1];
        this.buffers[1] = tmp;
    }

    getSourceBuffer():FrameBuffer{
        return this.buffers[0];
    }

    getDestBuffer():FrameBuffer{
        return this.buffers[1];
    }

    destroy(){
        if (this.buffers) this.buffers.forEach((b:FrameBuffer)=>b.destroy());
    }

}

export class Texture {

    gl:WebGLRenderingContext;
    tex:WebGLTexture = null;
    size:Size = new Size(0,0);
    isPowerOfTwo:boolean = false;
    _texFilterBuff:TextureFilterBuffer = null;

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
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 255, 0, 255]));
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        this._texFilterBuff = new TextureFilterBuffer(this);
    }


    // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); for bitmap textures
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    /**
     * @param img - if image is null, width and height must be specified
     * @param width -unused if image specified
     * @param height -unused if image specified
     */
    setImage(img:HTMLImageElement,width:number = 0,height:number = 0){
        if (DEBUG) {
            if (!(img || width || height))
                throw new DebugError("texture.setImage: if image is null, width and height must be specified: tex.setImage(null,w,h)");
        }

        const gl = this.gl;
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
        this.isPowerOfTwo = img?(isPowerOf2(img.width) && isPowerOf2(img.height)):false;
        // Check if the image is a power of 2 in both dimensions.
        if (this.isPowerOfTwo) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // NEAREST,LINEAR
        }
        gl.bindTexture(gl.TEXTURE_2D, null);

    }

    applyFilters(filters:AbstractFilter[]):Texture{
        let len:number = filters.length;
        if (len===0) return this;
        if (!this._texFilterBuff.buffers)
            this._texFilterBuff.instantiate(this.gl);
        let filter:AbstractFilter = filters[0];

        let texInfo:TextureInfo[] = [{texture:this,name:'texture'}]; // todo now to make this array reusable?
        filter.doFilter(texInfo,this._texFilterBuff.getDestBuffer());
        for (let i:number=1;i<len;i++){
            this._texFilterBuff.flip();
            let texInfo:TextureInfo[] = [{texture:this._texFilterBuff.getSourceBuffer().texture,name:'texture'}];
            filters[i].doFilter(
                texInfo, this._texFilterBuff.getDestBuffer()
            );
        }
        this._texFilterBuff.flip();
        return this._texFilterBuff.getSourceBuffer().texture;
    }

    bind(name:string,i:number,program:ShaderProgram) { // uniform eq to 0 by default
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
        let gl:WebGLRenderingContext = this.gl;
        gl.activeTexture(gl.TEXTURE0+i);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        Texture.currInstances[i] = this;
    }

    unbind(i:number = 0) {
        let gl:WebGLRenderingContext = this.gl;
        gl.activeTexture(gl.TEXTURE0+i);
        gl.bindTexture(gl.TEXTURE_2D, null);
        delete Texture.currInstances[i];
    }


    getColorArray():Uint8Array {
        let gl:WebGLRenderingContext = this.gl;
        let wxh:number = this.size.width*this.size.height;
        if (DEBUG && gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)
            throw new DebugError(`Texture.GetColorArray() failed!`);
        let pixels:Uint8Array = new Uint8Array(wxh * 4);
        gl.readPixels(0, 0, this.size.width, this.size.height, gl.RGBA,
        gl.UNSIGNED_BYTE, pixels);
        return pixels;
    }


    destroy(){
        if (this._texFilterBuff) this._texFilterBuff.destroy();
        this.gl.deleteTexture(this.tex);
    }

    getSize (){
        return this.size;
    }

    getGlTexture() {
        return this.tex;
    }

}



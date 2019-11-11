import {DebugError} from "@engine/debug/debugError";


import {INTERPOLATION_MODE, Texture} from "./texture";
import {Color} from "@engine/renderer/common/color";
import {Optional} from "@engine/core/declarations";


export class FrameBuffer {

    private static currInstance:Optional<FrameBuffer>;
    private gl:WebGLRenderingContext;

    private readonly texture:Texture;
    private glRenderBuffer:WebGLRenderbuffer;
    private glFrameBuffer:WebGLRenderbuffer;

    private readonly width:number;
    private readonly height:number;


    constructor(gl:WebGLRenderingContext,width:number,height:number){
        if (DEBUG && !gl)
            throw new DebugError("can not create FrameBuffer, gl context not passed to constructor, expected: FrameBuffer(gl)");

        this.gl = gl;
        this.width = width;
        this.height = height;

        this.texture = new Texture(gl);
        this.texture.setImage(undefined,width,height);
        this._init(gl,width,height);
    }

    public bind():void{
        if (FrameBuffer.currInstance===this) return;
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.glFrameBuffer);
        this.gl.viewport(0, 0, this.width,this.height);
        FrameBuffer.currInstance = this;
    }

    public unbind():void{
        this._checkBound();
        // tslint:disable-next-line:no-null-keyword
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        FrameBuffer.currInstance = undefined;
    }

    public clear(color:Color):void{
        this._checkBound();
        const arr:[number,number,number,number] = color.asGL();
        this.gl.clearColor(arr[0],arr[1],arr[2],arr[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    public destroy():void{
        this.gl.deleteRenderbuffer(this.glRenderBuffer);
        this.gl.deleteFramebuffer(this.glFrameBuffer);
    }


    public getTexture():Texture {
        return this.texture;
    }

    private _init(gl:WebGLRenderingContext,width:number,height:number):void{
        // Init Render Buffer
        this.glRenderBuffer = gl.createRenderbuffer() as WebGLRenderbuffer;
        if (DEBUG && !this.glRenderBuffer) throw new DebugError(`can not allocate memory for glRenderBuffer`);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.glRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        // Init Frame Buffer
        this.glFrameBuffer = gl.createFramebuffer() as WebGLFramebuffer;
        if (DEBUG && !this.glFrameBuffer) throw new DebugError(`can not allocate memory for glFrameBuffer`);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFrameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.getGlTexture(), 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.glRenderBuffer);
        // check
        const fbStatus:number = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (DEBUG && fbStatus!==gl.FRAMEBUFFER_COMPLETE) {
            throw new DebugError(`frame buffer status error: ${fbStatus} (expected gl.FRAMEBUFFER_COMPLETE(${gl.FRAMEBUFFER_COMPLETE}))`);
        }
        // Clean up
        this.texture.unbind();
        // tslint:disable-next-line:no-null-keyword
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        // tslint:disable-next-line:no-null-keyword
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    private _checkBound():void{
        if (DEBUG) return;
        if (FrameBuffer.currInstance!==this) throw new DebugError(`frame buffer is not bound; call bind() method firstly`);
    }

}

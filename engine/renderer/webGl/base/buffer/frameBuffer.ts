import {DebugError} from "@engine/debug/debugError";


import {Color} from "@engine/renderer/common/color";
import {IDestroyable, Optional} from "@engine/core/declarations";
import {ISize} from "@engine/geometry/size";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {FrameBufferTexture} from "@engine/renderer/webGl/base/texture/frameBufferTexture";
import {Texture} from "@engine/renderer/webGl/base/texture/texture";



export class FrameBuffer implements IRenderTarget, IDestroyable {


    constructor(private readonly _gl:WebGLRenderingContext,size:ISize){
        if (DEBUG && !_gl)
            throw new DebugError("can not create FrameBuffer, gl context not passed to constructor, expected: FrameBuffer(gl)");

        this._width = size.width;
        this._height = size.height;

        this.texture = new FrameBufferTexture(_gl);
        this.texture.setImage(undefined,size);
        this._init(_gl,size);
        const lastBound = FrameBuffer.currentBuffer;
        this.bind();
        this.clear(Color.RGB(0,0,0),true,0);
        this.unbind();
        if (lastBound && !lastBound.isDestroyed()) lastBound.bind();
    }

    private static currentBuffer:Optional<FrameBuffer>;

    private readonly texture:Texture;
    private glRenderBuffer:WebGLRenderbuffer;
    private glFrameBuffer:WebGLFramebuffer;

    private readonly _width:number;
    private readonly _height:number;

    private _destroyed:boolean = false;

    public static getCurrent():FrameBuffer{
        return this.currentBuffer!;
    }

    public setInterpolationMode(mode:INTERPOLATION_MODE):void {
        this.texture.setInterpolationMode(mode);
    }

    public bind():void{
        if (DEBUG) {
            if (this._destroyed) {
                console.error(this);
                throw new DebugError(`can not bind destroyed frame buffer`);
            }
        }
        if (FrameBuffer.currentBuffer===this) return;
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this.glFrameBuffer);
        this._gl.viewport(0, 0, ~~this._width,~~this._height);
        FrameBuffer.currentBuffer = this;
    }

    public unbind():void{
        this._checkBound();
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
        FrameBuffer.currentBuffer = undefined;
    }

    public clear(color:Color,withDepth:boolean = false,alphaBlendValue:number = 1):void{
        this._checkBound();
        const arr:Float32Array = color.asGL();
        this._gl.clearColor(arr[0],arr[1],arr[2],arr[3] * alphaBlendValue);
        const flag = withDepth?this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT:this._gl.COLOR_BUFFER_BIT;
        this._gl.clear(flag);
    }

    public destroy():void{
        this._gl.deleteRenderbuffer(this.glRenderBuffer);
        this._gl.deleteFramebuffer(this.glFrameBuffer);
        this._destroyed = true;
    }

    public isDestroyed():boolean {
        return this._destroyed;
    }


    public getTexture():Texture {
        return this.texture;
    }

    private _init(gl:WebGLRenderingContext,size:ISize):void{
        // Init Render Buffer
        this.glRenderBuffer = gl.createRenderbuffer() as WebGLRenderbuffer;
        if (DEBUG && !this.glRenderBuffer) throw new DebugError(`can not allocate memory for glRenderBuffer`);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.glRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size.width, size.height);
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
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    private _checkBound():void{
        if (!DEBUG) return;
        if (FrameBuffer.currentBuffer!==this) throw new DebugError(`frame buffer is not bound; call bind() method firstly`);
    }

}

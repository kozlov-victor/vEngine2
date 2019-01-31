import {DebugError} from "@engine/debugError";



import {Texture} from './texture'


export class FrameBuffer {

    static currInstance:FrameBuffer = null;

    private gl:WebGLRenderingContext;
    width:number;
    height:number;
    texture:Texture;
    glRenderBuffer:WebGLRenderbuffer;
    glFrameBuffer:WebGLRenderbuffer;

    constructor(gl:WebGLRenderingContext,width:number,height:number){
        if (DEBUG && !gl)
            throw new DebugError("can not create FrameBuffer, gl context not passed to constructor, expected: FrameBuffer(gl)");

        this.gl = gl;
        this.width = width;
        this.height = height;

        this.texture = new Texture(gl);
        this.texture.setImage(null,width,height);
        this._init(gl,width,height);
    }

    _init(gl:WebGLRenderingContext,width:number,height:number){
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
        let fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (DEBUG && fbStatus!==gl.FRAMEBUFFER_COMPLETE) {
            throw new DebugError(`frame buffer status error: ${fbStatus} (expected gl.FRAMEBUFFER_COMPLETE(${gl.FRAMEBUFFER_COMPLETE}))`);
        }
        // Clean up
        this.texture.unbind();
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    bind(){
        if (FrameBuffer.currInstance===this) return;
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.glFrameBuffer);
        this.gl.viewport(0, 0, this.width,this.height);
        FrameBuffer.currInstance = this;
    }

    unbind(){
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        FrameBuffer.currInstance = null;
    }

    destroy(){
        this.gl.deleteRenderbuffer(this.glRenderBuffer);
        this.gl.deleteFramebuffer(this.glFrameBuffer);
    }

    getTexture(){
        return this.texture;
    }

}

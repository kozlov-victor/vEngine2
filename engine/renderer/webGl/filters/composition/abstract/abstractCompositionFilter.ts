import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {SimpleRectPainter} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectPainter";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {ISize} from "@engine/geometry/size";
import {makeIdentityPositionMatrix} from "@engine/renderer/webGl/renderer/webGlRendererHelper";
import {Mat4} from "@engine/geometry/mat4";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import Mat16Holder = Mat4.Mat16Holder;
import IDENTITY = Mat4.IDENTITY;


export abstract class AbstractCompositionFilter extends AbstractGlFilter {

    private destCopy:FrameBuffer;
    private _simpleRectCopyPainter:SimpleRectPainter;

    protected constructor(game:Game) {
        super(game);
        const gl:WebGLRenderingContext = this.game.getRenderer<WebGlRenderer>().getNativeContext();
        this._simpleRectCopyPainter = new SimpleRectPainter(gl);
        this._simpleRectCopyPainter.initProgram();
        this.simpleRectPainter.gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'destTexture');
    }

    private watchFrameBuffer(destFrameBuffer:FrameBuffer):void {
        const gl:WebGLRenderingContext = this.game.getRenderer<WebGlRenderer>().getNativeContext();
        if (this.destCopy===undefined) {
            this.destCopy = new FrameBuffer(gl,destFrameBuffer.getTexture().size);
        } else if (!this.destCopy.getTexture().size.equals(destFrameBuffer.getTexture().size)) {
            this.destCopy.destroy();
            this.destCopy = new FrameBuffer(gl,destFrameBuffer.getTexture().size);
        }
    }

    public override doFilter(destFrameBuffer:FrameBuffer,nextFrameBuffer:FrameBuffer):void{

        this.watchFrameBuffer(destFrameBuffer);

        const size:ISize = destFrameBuffer.getTexture().size;
        const m16h:Mat16Holder = makeIdentityPositionMatrix(0,0,size);

        // 0. prepare for composition drawing
        this._simpleRectCopyPainter.setUniform(this._simpleRectCopyPainter.u_textureMatrix,IDENTITY);
        this._simpleRectCopyPainter.setUniform(this._simpleRectCopyPainter.u_vertexMatrix,m16h.mat16);
        this._simpleRectCopyPainter.setUniform(this._simpleRectCopyPainter.u_alpha,1);
        Blender.getSingleton(this.game.getRenderer<WebGlRenderer>().getNativeContext()).setBlendMode(BLEND_MODE.NORMAL);
        // 1. copy current destination texture to accumulatorBefore
        this.destCopy.bind();
        this.destCopy.clear(Color.NONE);
        this._simpleRectCopyPainter.attachTexture('texture',nextFrameBuffer.getTexture());
        this._simpleRectCopyPainter.draw();
        // 2. prepare nextFrameBuffer
        nextFrameBuffer.bind();
        nextFrameBuffer.clear(Color.NONE); // we dont require blending with this buffer, already blended
        // 3. attach destTexture as copy of destination
        this.simpleRectPainter.attachTexture('destTexture',this.destCopy.getTexture());
        // 4. filter
        super.doFilter(destFrameBuffer,nextFrameBuffer);
        // 5. complete
        m16h.release();

    }

    public override destroy():void {
        this.destCopy?.destroy();
    }

}

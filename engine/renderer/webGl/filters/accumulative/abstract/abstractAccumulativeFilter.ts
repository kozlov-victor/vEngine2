import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {SimpleRectPainter} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectPainter";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {Mat4} from "@engine/misc/math/mat4";
import {Color} from "@engine/renderer/common/color";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";


export abstract class AbstractAccumulativeFilter extends AbstractGlFilter {

    private accumulatorBefore:FrameBuffer;
    private accumulatorAfter:FrameBuffer;
    private _simpleRectCopyPainter:SimpleRectPainter;

    constructor(game:Game) {
        super(game);
        const gl:WebGLRenderingContext = this.game.getRenderer(WebGlRenderer).getNativeContext();
        this._simpleRectCopyPainter = new SimpleRectPainter(gl);
        this._simpleRectCopyPainter.initProgram();
        this.accumulatorBefore = new FrameBuffer(gl,this.game.size);
        this.accumulatorAfter  = new FrameBuffer(gl,this.game.size);
    }

    private watchFrameBuffer(destFrameBuffer:FrameBuffer):void {
        const gl:WebGLRenderingContext = this.game.getRenderer(WebGlRenderer).getNativeContext();
        if (this.accumulatorBefore===undefined) {
            this.accumulatorBefore = new FrameBuffer(gl,destFrameBuffer.getTexture().size);
            this.accumulatorAfter = new FrameBuffer(gl,destFrameBuffer.getTexture().size);
        } else if (!this.accumulatorBefore.getTexture().size.equals(destFrameBuffer.getTexture().size)) {
            this.accumulatorBefore.destroy();
            this.accumulatorAfter.destroy();
            this.accumulatorBefore = new FrameBuffer(gl,destFrameBuffer.getTexture().size);
            this.accumulatorAfter = new FrameBuffer(gl,destFrameBuffer.getTexture().size);
        }
    }

    public override doFilter(destFrameBuffer:FrameBuffer):void{

        this.watchFrameBuffer(destFrameBuffer);
        // 0. prepare for accumulator drawing
        this._simpleRectCopyPainter.setUniform(this._simpleRectCopyPainter.u_alpha,1);
        this._simpleRectCopyPainter.setUniform(this._simpleRectCopyPainter.u_flip,false);
        Blender.getSingleton(this.game.getRenderer(WebGlRenderer).getNativeContext()).setBlendMode(BLEND_MODE.NORMAL);
        // 1. copy accumulatorAfter to accumulatorBefore
        this.accumulatorBefore.bind();
        this.accumulatorBefore.clear(Color.NONE);
        this._simpleRectCopyPainter.attachTexture('texture',this.accumulatorAfter.getTexture());
        this._simpleRectCopyPainter.draw();
        // 2. copy current source texture to accumulatorBefore
        this.accumulatorBefore.bind();
        this._simpleRectCopyPainter.attachTexture('texture',this.simpleRectPainter.getAttachedTextureAt(0));
        this._simpleRectCopyPainter.draw();

        // 3. apply filter to destFrameBuffer
        this.simpleRectPainter.attachTexture('texture',this.accumulatorBefore.getTexture());
        super.doFilter(destFrameBuffer);

        // 4. destFrameBuffer to accumulatorAfter
        this.accumulatorAfter.bind();
        this.accumulatorAfter.clear(Color.NONE);
        this._simpleRectCopyPainter.attachTexture('texture',destFrameBuffer.getTexture());
        this._simpleRectCopyPainter.draw();
    }

    public override destroy() {
        this.accumulatorBefore?.destroy();
        this.accumulatorAfter?.destroy();
    }

}

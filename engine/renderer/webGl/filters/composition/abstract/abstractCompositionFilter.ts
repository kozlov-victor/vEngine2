import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectDrawer";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {ISize} from "@engine/geometry/size";
import {makeIdentityPositionMatrix} from "@engine/renderer/webGl/webGlRendererHelper";
import {Mat4} from "@engine/geometry/mat4";
import {Color} from "@engine/renderer/common/color";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import Mat16Holder = Mat4.Mat16Holder;
import IDENTITY = Mat4.IDENTITY;


export abstract class AbstractCompositionFilter extends AbstractGlFilter {

    private accumulatorBefore:FrameBuffer;
    private _simpleRectCopyDrawer:SimpleRectDrawer;

    constructor(game:Game) {
        super(game);
        const gl:WebGLRenderingContext = this.game.getRenderer<WebGlRenderer>().getNativeContext();
        this._simpleRectCopyDrawer = new SimpleRectDrawer(gl);
        this._simpleRectCopyDrawer.initProgram();
        this.accumulatorBefore = new FrameBuffer(gl,this.game.size);
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{
        const size:ISize = destFrameBuffer.getTexture().size;
        const m16h:Mat16Holder = makeIdentityPositionMatrix(0,0,size);

        // 0. prepare for composition drawing
        this._simpleRectCopyDrawer.setUniform(this._simpleRectCopyDrawer.u_textureMatrix,IDENTITY);
        this._simpleRectCopyDrawer.setUniform(this._simpleRectCopyDrawer.u_vertexMatrix,m16h.mat16);
        Blender.getSingleton(this.game.getRenderer<WebGlRenderer>().getNativeContext()).setBlendMode(BLEND_MODE.NORMAL);
        // 2. copy current source texture to accumulatorBefore
        this.accumulatorBefore.bind();
        this._simpleRectCopyDrawer.attachTexture('texture',this.simpleRectDrawer.getAttachedTextureAt(0));
        this._simpleRectCopyDrawer.draw();

        // 3. apply filter to destFrameBuffer
        this.simpleRectDrawer.attachTexture('texturePrev',this.accumulatorBefore.getTexture());
        super.doFilter(destFrameBuffer);

        m16h.release();
    }

}

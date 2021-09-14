import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectDrawer";
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
    private _simpleRectCopyDrawer:SimpleRectDrawer;

    constructor(game:Game) {
        super(game);
        const gl:WebGLRenderingContext = this.game.getRenderer<WebGlRenderer>().getNativeContext();
        this._simpleRectCopyDrawer = new SimpleRectDrawer(gl);
        this._simpleRectCopyDrawer.initProgram();
        this.destCopy = new FrameBuffer(gl,this.game.size);
        this.simpleRectDrawer.gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'destTexture');
    }

    public override doFilter(destFrameBuffer:FrameBuffer,nextFrameBuffer:FrameBuffer):void{
        const size:ISize = destFrameBuffer.getTexture().size;
        const m16h:Mat16Holder = makeIdentityPositionMatrix(0,0,size);

        // 0. prepare for composition drawing
        this._simpleRectCopyDrawer.setUniform(this._simpleRectCopyDrawer.u_textureMatrix,IDENTITY);
        this._simpleRectCopyDrawer.setUniform(this._simpleRectCopyDrawer.u_vertexMatrix,m16h.mat16);
        Blender.getSingleton(this.game.getRenderer<WebGlRenderer>().getNativeContext()).setBlendMode(BLEND_MODE.NORMAL);
        // 1. copy current destination texture to accumulatorBefore
        this.destCopy.bind();
        this.destCopy.clear(Color.NONE);
        this._simpleRectCopyDrawer.attachTexture('texture',nextFrameBuffer.getTexture());
        this._simpleRectCopyDrawer.draw();
        // 2. prepare nextFrameBuffer
        nextFrameBuffer.bind();
        nextFrameBuffer.clear(Color.NONE); // we dont require blending with this buffer, already blended
        // 3. attach destTexture as copy of destination
        this.simpleRectDrawer.attachTexture('destTexture',this.destCopy.getTexture());
        // 4. filter
        super.doFilter(destFrameBuffer,nextFrameBuffer);
        // 5. complete
        m16h.release();

    }

}

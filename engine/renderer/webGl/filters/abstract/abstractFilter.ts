import {FrameBuffer} from "../../base/frameBuffer";
import {DebugError} from "@engine/debug/debugError";
import {mat4} from "@engine/geometry/mat4";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectDrawer";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import Mat16Holder = mat4.Mat16Holder;
import {AbstractDrawer} from "@engine/renderer/webGl/programs/abstract/abstractDrawer";
import {Color} from "@engine/renderer/color";
import {IFilter} from "@engine/renderer/ifilter";


const makePositionMatrix = (dstX:number,dstY:number,dstWidth:number,dstHeight:number):Mat16Holder =>{
    const projectionMatrix:Mat16Holder = Mat16Holder.fromPool();
    mat4.ortho(projectionMatrix,0,dstWidth,0,dstHeight,-1,1);
    const scaleMatrix:Mat16Holder = Mat16Holder.fromPool();
    mat4.makeScale(scaleMatrix,dstWidth, dstHeight, 1);
    const result:Mat16Holder = Mat16Holder.fromPool();
    mat4.matrixMultiply(result,scaleMatrix, projectionMatrix);
    projectionMatrix.release();
    scaleMatrix.release();
    return result;
};

const IDENTITY:Mat16Holder = Mat16Holder.create();
mat4.makeIdentity(IDENTITY);
const BLACK:Color = Color.RGB(0,0,0,0);

export abstract class AbstractFilter implements IFilter {

    public readonly type:string = 'WebglFilter';

    protected gl:WebGLRenderingContext;
    protected simpleRectDrawer:SimpleRectDrawer;


    protected constructor(game:Game){

        const renderer:AbstractRenderer = game.getRenderer();
        if (DEBUG && !(renderer instanceof WebGlRenderer)) {
            throw new DebugError(`can not apply filter: filters awailable only for WebGlRenerer`);
        }

        this.gl = (game.getRenderer() as any as WebGlRenderer).getNativeContext();
        this.simpleRectDrawer = new SimpleRectDrawer(this.gl);
    }

    public setUniform(name:string,value:UNIFORM_VALUE_TYPE):void{
        this.simpleRectDrawer.setUniform(name,value);
    }

    public getDrawer():AbstractDrawer{
        return this.simpleRectDrawer;
    }

    public doFilter(destFrameBuffer:FrameBuffer){ // todo remove destFrameBuffer from arg and extract interface with doFilter() method
        destFrameBuffer.bind();
        const {width,height} = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,IDENTITY.mat16);
        const m16h:Mat16Holder = makePositionMatrix(0,0,width,height);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,m16h.mat16);
        m16h.release();
        destFrameBuffer.clear(BLACK);
        this.simpleRectDrawer.draw();
    }

}
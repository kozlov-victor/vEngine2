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
import {Color} from "@engine/renderer/common/color";
import {IFilter} from "@engine/renderer/common/ifilter";
import {FastMap} from "@engine/misc/collection/fastMap";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/texture";


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

export abstract class AbstractGlFilter implements IFilter {

    public readonly type:string = 'WebglFilter';

    protected gl:WebGLRenderingContext;
    protected simpleRectDrawer:SimpleRectDrawer;
    private uniformCache:FastMap<string,UNIFORM_VALUE_TYPE> = new FastMap();


    protected constructor(protected game:Game){

        const renderer:AbstractRenderer = game.getRenderer();
        if (DEBUG && !(renderer instanceof WebGlRenderer)) {
            throw new DebugError(`can not apply filter: filters awailable only for WebGlRenerer`);
        }

        this.gl = (game.getRenderer() as any as WebGlRenderer).getNativeContext();
        this.simpleRectDrawer = new SimpleRectDrawer(this.gl);
    }

    public setUniform(name:string,value:UNIFORM_VALUE_TYPE):void{
        this.uniformCache.put(name,value);
    }

    public getDrawer():AbstractDrawer{
        return this.simpleRectDrawer;
    }

    public doFilter(destFrameBuffer:FrameBuffer){
        destFrameBuffer.bind();
        const keys:string[] = this.uniformCache.getKeys();
        for (let i = 0; i < keys.length; i++) {
            const name:string = keys[i];
            const value:UNIFORM_VALUE_TYPE = this.uniformCache.get(keys[i])!;
            this.simpleRectDrawer.setUniform(name,value);
        }
        const {width,height} = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,IDENTITY.mat16);
        const m16h:Mat16Holder = makePositionMatrix(0,0,width,height);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,m16h.mat16);
        m16h.release();
        destFrameBuffer.clear(BLACK);
        this.simpleRectDrawer.draw();
    }

}
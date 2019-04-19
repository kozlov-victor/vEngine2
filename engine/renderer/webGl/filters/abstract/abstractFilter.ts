import {FrameBuffer} from "../../base/frameBuffer";
import {DebugError} from "@engine/debug/debugError";
import {mat4} from "@engine/geometry/mat4";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/SimpleRectDrawer";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import Mat16Holder = mat4.Mat16Holder;
import {AbstractDrawer} from "@engine/renderer/webGl/programs/abstract/abstractDrawer";


const makePositionMatrix = (dstX:number,dstY:number,dstWidth:number,dstHeight:number):Mat16Holder =>{
    const projectionMatrix:Mat16Holder = mat4.ortho(0,dstWidth,0,dstHeight,-1,1);
    const scaleMatrix:Mat16Holder = mat4.makeScale(dstWidth, dstHeight, 1);
    return mat4.matrixMultiply(scaleMatrix, projectionMatrix);
};

const identity:Mat16Holder = mat4.makeIdentity();

export abstract class AbstractFilter {

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

    setUniform(name:string,value:UNIFORM_VALUE_TYPE):void{
        this.simpleRectDrawer.setUniform(name,value);
    }

    getDrawer():AbstractDrawer{
        return this.simpleRectDrawer;
    }

    doFilter(destFrameBuffer:FrameBuffer){
        destFrameBuffer.bind();
        const {width,height} = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,identity.mat16);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,makePositionMatrix(0,0,width,height).mat16);
        this.gl.clearColor(0,0,0,0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.simpleRectDrawer.draw();
    }

}
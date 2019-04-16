import {TextureInfo} from "../../programs/abstract/abstractDrawer";
import {FrameBuffer} from "../../base/frameBuffer";
import {DebugError} from "@engine/debug/debugError";
import {mat4} from "@engine/geometry/mat4";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/SimpleRectDrawer";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import MAT16 = mat4.MAT16;
import Mat16Holder = mat4.Mat16Holder;
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";


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

    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        destFrameBuffer.bind();
        let w:number = textureInfos[0].texture.size.width;
        let h:number = textureInfos[0].texture.size.height;
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,identity.mat16);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,makePositionMatrix(0,0,w,h).mat16);
        this.gl.clearColor(0,0,0,0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.simpleRectDrawer.draw(textureInfos);
    }

}
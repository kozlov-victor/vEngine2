import {TextureInfo} from "../../programs/abstract/abstractDrawer";
import {FrameBuffer} from "../../base/frameBuffer";
import {DebugError} from "@engine/debugError";
import {mat4} from "@engine/core/geometry/mat4";
import {SimpleRectDrawer} from "@engine/core/renderer/webGl/programs/impl/base/SimpleRectDrawer";
import MAT16 = mat4.MAT16;


const makePositionMatrix = (dstX:number,dstY:number,dstWidth:number,dstHeight:number):number[] =>{
    let projectionMatrix:MAT16 = mat4.ortho(0,dstWidth,0,dstHeight,-1,1);
    let scaleMatrix:MAT16 = mat4.makeScale(dstWidth, dstHeight, 1);
    return mat4.matrixMultiply(scaleMatrix, projectionMatrix);
};

const identity:number[] = mat4.makeIdentity();

export abstract class AbstractFilter {

    protected gl:WebGLRenderingContext;
    protected simpleRectDrawer:SimpleRectDrawer;


    protected constructor(gl:WebGLRenderingContext){
        this.gl = gl;
        this.simpleRectDrawer = new SimpleRectDrawer(this.gl);
    }

    setUniform(name:string,value:any){
        this.simpleRectDrawer.setUniform(name,value);
    }

    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        destFrameBuffer.bind();
        let w:number = textureInfos[0].texture.size.width;
        let h:number = textureInfos[0].texture.size.height;
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,identity);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,makePositionMatrix(0,0,w,h));
        this.gl.clearColor(1,1,1,0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.simpleRectDrawer.draw(textureInfos);
    }

}
import {TextureInfo} from "../../renderPrograms/abstract/abstractDrawer";
import {FrameBuffer} from "../../base/frameBuffer";
import {DebugError} from "@engine/debugError";
import {mat4} from "@engine/core/geometry/mat4";
import {SimpleRectDrawer2} from "@engine/core/renderer/webGl/renderPrograms/impl/base/SimpleRectDrawer2";
import MAT16 = mat4.MAT16;


const makePositionMatrix = (dstX:number,dstY:number,dstWidth:number,dstHeight:number):number[] =>{
    let projectionMatrix:MAT16 = mat4.ortho(0,dstWidth,0,dstHeight,-1,1);
    let scaleMatrix:MAT16 = mat4.makeScale(dstWidth, dstHeight, 1);
    return mat4.matrixMultiply(scaleMatrix, projectionMatrix);
};

const identity:number[] = mat4.makeIdentity();

export abstract class AbstractFilter {

    protected gl:WebGLRenderingContext;
    protected spriteRectDrawer:SimpleRectDrawer2;


    protected constructor(gl:WebGLRenderingContext){
        if (DEBUG && !gl) {
            console.error(this);
            throw new DebugError("can not create Filter, gl context not passed to constructor, expected: Filter(gl)");
        }
        this.gl = gl;
        this.spriteRectDrawer = new SimpleRectDrawer2(this.gl);
    }

    setUniform(name:string,value:any){
        this.spriteRectDrawer.setUniform(name,value);
    }

    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        if (destFrameBuffer) destFrameBuffer.bind();
        let w:number = textureInfos[0].texture.size.width;
        let h:number = textureInfos[0].texture.size.height;
        this.spriteRectDrawer.setUniform(this.spriteRectDrawer.u_textureMatrix,identity);
        this.spriteRectDrawer.setUniform(this.spriteRectDrawer.u_vertexMatrix,makePositionMatrix(0,0,w,h));
        this.gl.clearColor(1,1,1,0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteRectDrawer.draw(textureInfos,undefined,null);
    }

}
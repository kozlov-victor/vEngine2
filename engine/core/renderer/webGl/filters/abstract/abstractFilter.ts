import {TextureInfo} from "../../renderPrograms/abstract/abstractDrawer";
import {ShaderProgram} from "../../base/shaderProgram";
import {TexShaderGenerator} from "../../shaders/generators/impl/texShaderGenerator";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {FrameBuffer} from "../../base/frameBuffer";
import {DebugError} from "@engine/debugError";
import {mat4} from "@engine/core/geometry/mat4";
import {SimpleRectDrawer} from "@engine/core/renderer/webGl/renderPrograms/impl/base/simpleRectDrawer";
import MAT16 = mat4.MAT16;


const makePositionMatrix = (dstX:number,dstY:number,dstWidth:number,dstHeight:number):number[] =>{
    let projectionMatrix:MAT16 = mat4.ortho(0,dstWidth,0,dstHeight,-1,1);
    let scaleMatrix:MAT16 = mat4.makeScale(dstWidth, dstHeight, 1);
    return mat4.matrixMultiply(scaleMatrix, projectionMatrix);
};

const identity:number[] = mat4.makeIdentity();

export abstract class AbstractFilter {

    protected gl:WebGLRenderingContext;
    protected spriteRectDrawer:SimpleRectDrawer;
    protected uniformsToSet:any = {};

    protected constructor(gl:WebGLRenderingContext){
        if (DEBUG && !gl) {
            console.error(this);
            throw new DebugError("can not create Filter, gl context not passed to constructor, expected: Filter(gl)");
        }
        this.gl = gl;
        let gen = new TexShaderGenerator();
        this.prepare(gen);
        this._afterPrepare(gen);
    }

    protected prepare(gen:ShaderGenerator){}

    private _afterPrepare(gen:ShaderGenerator){
        let program = new ShaderProgram(
            this.gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        this.spriteRectDrawer = new SimpleRectDrawer(this.gl,program);
    }

    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        if (destFrameBuffer) destFrameBuffer.bind();
        let w:number = textureInfos[0].texture.size.width;
        let h:number = textureInfos[0].texture.size.height;
        this.uniformsToSet.u_textureMatrix = identity;
        this.uniformsToSet.u_vertexMatrix = makePositionMatrix(0,0,w,h);
        this.gl.clearColor(1,1,1,0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteRectDrawer.draw(textureInfos,this.uniformsToSet,null);
    }

    protected setParam(name:string,value:any){
        this.uniformsToSet[name] = value;
    }

}
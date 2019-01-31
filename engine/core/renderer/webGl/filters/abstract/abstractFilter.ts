
import {TextureInfo} from "../../renderPrograms/abstract/abstractDrawer";



import {ShaderProgram} from "../../base/shaderProgram";
import {SpriteRectDrawer} from "../../renderPrograms/impl/base/spriteRectDrawer";
import * as mat4 from "../../../../geometry/mat4";
import {TexShaderGenerator} from "../../shaders/generators/impl/texShaderGenerator";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {Texture} from "../../base/texture";
import {FrameBuffer} from "../../base/frameBuffer";
import {DebugError} from "../../../../../debugError";


const makePositionMatrix = (dstX:number,dstY:number,dstWidth:number,dstHeight:number):number[] =>{
    let projectionMatrix:number[] = mat4.ortho(0,dstWidth,0,dstHeight,-1,1);
    let scaleMatrix:number[] = mat4.makeScale(dstWidth, dstHeight, 1);
    return mat4.matrixMultiply(scaleMatrix, projectionMatrix);
};

const identity:number[] = mat4.makeIdentity();

export abstract class AbstractFilter {

    gl:WebGLRenderingContext;
    spriteRectDrawer:SpriteRectDrawer = null;
    uniformsToSet:any = {};

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

    prepare(gen:ShaderGenerator){}

    _afterPrepare(gen:ShaderGenerator){
        let program = new ShaderProgram(
            this.gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        this.spriteRectDrawer = new SpriteRectDrawer(this.gl,program);
    }

    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        if (destFrameBuffer) destFrameBuffer.bind();
        let w:number = textureInfos[0].texture.size.width;
        let h:number = textureInfos[0].texture.size.height;
        this.uniformsToSet.u_textureMatrix = identity;
        this.uniformsToSet.u_vertexMatrix = makePositionMatrix(0,0,w,h);
        this.spriteRectDrawer.draw(textureInfos,this.uniformsToSet,null);
    }

    setParam(name:string,value:any){
        this.uniformsToSet[name] = value;
    }

}
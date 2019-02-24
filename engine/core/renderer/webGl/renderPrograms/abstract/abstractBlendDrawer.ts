

import {GL_TYPE} from "../../base/shaderProgramUtils";
import {TexShaderGenerator} from "../../shaders/generators/impl/texShaderGenerator";
import {ShaderProgram} from "../../base/shaderProgram";
import {SimpleCopyFilter} from "../../filters/textureFilters/simpleCopyFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {FrameBuffer} from "../../base/frameBuffer";
import {TextureInfo} from "./abstractDrawer";
import {IDrawer} from "../interface/iDrawer";
import {UniformsInfo} from "../interface/uniformsInfo";
import {SimpleRectDrawer} from "@engine/core/renderer/webGl/renderPrograms/impl/base/simpleRectDrawer";

export abstract class AbstractBlendDrawer implements IDrawer {

    protected spriteRectDrawer:SimpleRectDrawer;
    protected simpleCopyFilter:SimpleCopyFilter;
    protected gl:WebGLRenderingContext;
    protected program:ShaderProgram;

    constructor(gl:WebGLRenderingContext) {
        this.gl = gl;
        let gen:TexShaderGenerator = new TexShaderGenerator();
        gen.addVarying(GL_TYPE.FLOAT_VEC4, 'v_destTexCoord');
        gen.addFragmentUniform(GL_TYPE.SAMPLER_2D,'destTexture');
        //language=GLSL
        gen.setVertexMainFn(`
            void main(){
                gl_Position = u_vertexMatrix * a_position;
                v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
                v_destTexCoord = gl_Position*0.5+0.5; 
            }
        `);
        this.prepare(gen);
        this._afterPrepare(gen);
        this.simpleCopyFilter = new SimpleCopyFilter(gl);
    }

    private _afterPrepare(gen:ShaderGenerator){
        this.program = new ShaderProgram(
            this.gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        this.spriteRectDrawer = new SimpleRectDrawer(this.gl,this.program);
    }


    protected prepare(programGen:ShaderGenerator){}

    // destTex is copy or current destination texture
    // to avoid "Source and destination textures of the draw are the same" error
    draw(textureInfos:Array<TextureInfo>,uniforms:UniformsInfo,frameBuffer:FrameBuffer){
        let destTex = frameBuffer.texture.applyFilters([this.simpleCopyFilter],frameBuffer);
        textureInfos.push({texture:destTex,name:'destTexture'});
        this.spriteRectDrawer.draw(textureInfos,uniforms,frameBuffer);
    }

}

import {AbstractFilter} from "@engine/core/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/core/renderer/webGl/shaders/generators/shaderGenerator";
import {TextureInfo} from "@engine/core/renderer/webGl/programs/abstract/abstractDrawer";
import {FrameBuffer} from "@engine/core/renderer/webGl/base/frameBuffer";
import {GL_TYPE} from "@engine/core/renderer/webGl/base/shaderProgramUtils";
import {Texture} from "@engine/core/renderer/webGl/base/texture";

// http://evanw.github.io/webgl-filter/

export class SwirlFilter extends AbstractFilter {

    private center:string;
    private angle:string;
    private radius:string;
    private texSize:string;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.angle = programGen.addFragmentUniform(GL_TYPE.FLOAT,'angle');
        this.radius = programGen.addFragmentUniform(GL_TYPE.FLOAT,'radius');
        this.center = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'center');
        this.texSize = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'texSize');


        //language=GLSL
        programGen.appendFragmentCodeBlock(`            
            
        `);
        //language=GLSL
        programGen.setFragmentMainFn(`
                    void main(){
                        vec2 texCoord = v_texCoord;
                        vec2 coord=texCoord*texSize;
                        coord-=center;
                        float distance=length(coord);
                        if(distance<radius){
                            float percent=(radius-distance)/radius;
                            float theta=percent*percent*angle;
                            float s=sin(theta);
                            float c=cos(theta);
                            coord=vec2(coord.x*c-coord.y*s,coord.x*s+coord.y*c);
                        }
                        coord+=center;
                        gl_FragColor=texture2D(texture,coord/texSize);
                    }
        `);
        this.simpleRectDrawer.initProgram();
        this.setAngle(2*Math.PI);
        this.setRadius(100);
    }


    setRadius(val:number){
        this.setUniform(this.radius,val);
    }

    setAngle(val:number){
        this.setUniform(this.angle,val);
    }


    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        const tex:Texture = textureInfos[0].texture;
        this.setUniform(this.texSize,[tex.size.width,tex.size.height]);
        this.setUniform(this.center,[tex.size.width/2,tex.size.height/2]);
        super.doFilter(textureInfos,destFrameBuffer);
    }


}
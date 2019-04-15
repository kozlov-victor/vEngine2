import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {TextureInfo} from "@engine/renderer/webGl/programs/abstract/abstractDrawer";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Game} from "@engine/game";

// http://evanw.github.io/webgl-filter/

export class TriangleBlurFilter extends AbstractFilter {

    private delta:string;
    private texSize:string;

    constructor(protected game:Game) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.delta = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'delta');
        this.texSize = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'texSize');


        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec2 texCoord = v_texCoord;
                vec4 color=vec4(0.0);
                float total=0.0;
                float offset=0.01;// random
                for (float t=-30.0;t<=30.0;t++){
                    float percent=(t+offset-0.5)/30.0;
                    float weight=1.0-abs(percent);
                    vec4 sampl=texture2D(texture, texCoord+delta*percent);
                    sampl.rgb*=sampl.a;
                    color+=sampl*weight;
                    total+=weight;
                }
                gl_FragColor=color/total;
                gl_FragColor.rgb/=gl_FragColor.a+0.00001;
            }
        `);
        this.simpleRectDrawer.initProgram();
        this.setValue(0.025);
    }

    // 0...1
    setValue(val:number):void{
        this.setUniform(this.delta,[val,val]);
    }



    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer):void{
        const tex:Texture = textureInfos[0].texture;
        this.setUniform(this.texSize,[tex.size.width,tex.size.height]);
        super.doFilter(textureInfos,destFrameBuffer);
    }


}
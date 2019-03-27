
import {AbstractFilter} from "@engine/core/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/core/renderer/webGl/shaders/generators/shaderGenerator";
import {TextureInfo} from "@engine/core/renderer/webGl/programs/abstract/abstractDrawer";
import {FrameBuffer} from "@engine/core/renderer/webGl/base/frameBuffer";
import {GL_TYPE} from "@engine/core/renderer/webGl/base/shaderProgramUtils";
import {Texture} from "@engine/core/renderer/webGl/base/texture";
import {Game} from "@engine/core/game";

// http://evanw.github.io/webgl-filter/

export class MotionBlurFilter extends AbstractFilter {

    private center:string;
    private strength:string;
    private texSize:string;

    constructor(game:Game) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.strength = programGen.addFragmentUniform(GL_TYPE.FLOAT,'strength');
        this.center = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'center');
        this.texSize = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'texSize');


        //language=GLSL
        programGen.appendFragmentCodeBlock(`
            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
        `);
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main() {
                vec2 texCoord = v_texCoord;
                vec4 color=vec4(0.0);
                float total=0.0;
                vec2 toCenter=center-texCoord*texSize;
                float offset=rand(texCoord);
                for(float t=0.0;t<=40.0;t++) {
                    float percent=(t+offset)/40.0;
                    float weight=4.0*(percent-percent*percent);
                    vec4 sampl=texture2D(texture,texCoord+toCenter*percent*strength/texSize);
                    sampl.rgb*=sampl.a;
                    color+=sampl*weight;
                    total+=weight;
                }
                gl_FragColor = color/total;
                gl_FragColor.rgb /= gl_FragColor.a+0.00001;
            }
        `);
        this.simpleRectDrawer.initProgram();
        this.setStrength(0.3);
    }


    setStrength(val:number){
        this.setUniform(this.strength,val);
    }



    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        const tex:Texture = textureInfos[0].texture;
        this.setUniform(this.texSize,[tex.size.width,tex.size.height]);
        this.setUniform(this.center,[100,100]);
        super.doFilter(textureInfos,destFrameBuffer);
    }


}
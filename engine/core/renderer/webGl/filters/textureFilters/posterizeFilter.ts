
// http://www.geeks3d.com/20091027/shader-library-posterization-post-processing-effect-glsl/
// adopted to webGl ES

import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Texture} from "../../base/texture";
import {FrameBuffer} from "../../base/frameBuffer";
import {Game} from "@engine/core/game";

export class PosterizeFilter extends AbstractFilter {

    private readonly gamma:string;
    private readonly numColors:string;

    constructor(game:Game) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();

        const programGen = this.simpleRectDrawer.gen;
        this.gamma = programGen.addFragmentUniform(GL_TYPE.FLOAT,'gamma');
        this.numColors = programGen.addFragmentUniform(GL_TYPE.FLOAT,'numColors');
        //language=GLSL
        programGen.setFragmentMainFn(`
              void main(){
                  vec4 tex = texture2D(texture, v_texCoord.xy);
                  vec3 c = tex.rgb;
                  c = pow(c, vec3(gamma));
                  c = c * numColors;
                  c = floor(c);
                  c = c / numColors;
                  c = pow(c, vec3(1.0/gamma));
                  gl_FragColor = vec4(c, tex.a);
              }
            `
        );
        this.simpleRectDrawer.initProgram();
        this.setGamma(0.6);
        this.setNumOfColors(8);
    }


    setGamma(n:number){
        this.setUniform(this.gamma,n);
    }

    setNumOfColors(n:number){
        this.setUniform(this.numColors,n);
    }

}
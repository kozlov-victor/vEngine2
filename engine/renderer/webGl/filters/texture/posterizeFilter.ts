
// http://www.geeks3d.com/20091027/shader-library-posterization-post-processing-effect-glsl/
// adopted to webGl ES

import {AbstractFilter} from "../abstract/abstractFilter";
import {GL_TYPE} from "../../base/shaderProgramUtils";
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
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
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


    public setGamma(n:number):void{
        this.setUniform(this.gamma,n);
    }

    public setNumOfColors(n:number):void{
        this.setUniform(this.numColors,n);
    }

}
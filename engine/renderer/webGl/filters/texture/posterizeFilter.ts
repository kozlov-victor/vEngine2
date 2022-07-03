
// http://www.geeks3d.com/20091027/shader-library-posterization-post-processing-effect-glsl/
// adopted to webGl ES

import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Game} from "@engine/core/game";

export class PosterizeFilter extends AbstractGlFilter {

    private readonly gamma:string;
    private readonly numColors:string;

    constructor(game:Game) {
        super(game);

        const programGen = this.simpleRectPainter.gen;
        this.gamma = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'gamma');
        this.numColors = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'numColors');
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
        this.setGamma(0.6);
        this.setNumOfColors(8);
        this.simpleRectPainter.initProgram();
    }


    public setGamma(n:number):this{
        this.setUniform(this.gamma,n);
        return this;
    }

    public setNumOfColors(n:number):this{
        this.setUniform(this.numColors,n);
        return this;
    }

}

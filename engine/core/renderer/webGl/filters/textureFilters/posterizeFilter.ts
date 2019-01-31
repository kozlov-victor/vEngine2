
// http://www.geeks3d.com/20091027/shader-library-posterization-post-processing-effect-glsl/
// adopted to webGl ES

import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Texture} from "../../base/texture";
import {FrameBuffer} from "../../base/frameBuffer";

export class PosterizeFilter extends AbstractFilter {

    constructor(gl: WebGLRenderingContext) {
        super(gl);
    }

    prepare(programGen:ShaderGenerator){
        programGen.addFragmentUniform(GL_TYPE.FLOAT,' gamma');
        programGen.addFragmentUniform(GL_TYPE.FLOAT,'numColors');
        //language=GLSL
        programGen.setFragmentMainFn(`
              void main(){
                  vec3 c = texture2D(texture, v_texCoord.xy).rgb;
                  c = pow(c, vec3(gamma));
                  c = c * numColors;
                  c = floor(c);
                  c = c / numColors;
                  c = pow(c, vec3(1.0/gamma));
                  gl_FragColor = vec4(c, 1.0);
              }
            `
        );
        this.setParam('gamma',0.6);
        this.setParam('numColors',8);
    }

}
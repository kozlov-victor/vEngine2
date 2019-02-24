


import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Color} from "../../../color";

export class ColorizeFilter extends AbstractFilter{

    constructor(gl:WebGLRenderingContext){
        super(gl);
    }

    protected prepare(programGen:ShaderGenerator){
        programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'uPixelColor');
        this.setColor(Color.NONE);
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec4 col = texture2D(texture, v_texCoord);
                vec3 r = vec3(col) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
                vec4 result = vec4(r, col.a);
                gl_FragColor = result;
            }
        `);
    }

    setColor(c:Color){
        this.setParam('uPixelColor',c.clone().asGL());
    }

}
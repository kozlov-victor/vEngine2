import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Color} from "../../../common/color";
import {Game} from "@engine/core/game";

export class ColorizeFilter extends AbstractGlFilter{

    private readonly uPixelColor: string;

    constructor(game:Game){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.uPixelColor = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'uPixelColor');
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec4 col = texture2D(texture, v_texCoord);
                vec3 r = vec3(col) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
                vec4 result = vec4(r, col.a);
                gl_FragColor = result;
            }
        `);
        this.setColor(Color.NONE);
        this.simpleRectDrawer.initProgram();
    }


    public setColor(c:Color):void{
        this.setUniform(this.uPixelColor,c.asGL());
    }

}
import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Color} from "../../../color";
import {Game} from "@engine/game";

export class ColorizeFilter extends AbstractFilter{

    private readonly uPixelColor: string;

    constructor(game:Game){
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.uPixelColor = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'uPixelColor');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec4 col = texture2D(texture, v_texCoord);
                vec3 r = vec3(col) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
                vec4 result = vec4(r, col.a);
                gl_FragColor = result;
            }
        `);
        this.simpleRectDrawer.initProgram();
        this.setColor(Color.NONE);
    }


    setColor(c:Color):void{
        this.setUniform(this.uPixelColor,c.clone().asGL());
    }

}
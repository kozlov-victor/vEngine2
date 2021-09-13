import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {ShaderGenerator} from "../../shaderGenerator/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Color} from "../../../common/color";
import {Game} from "@engine/core/game";

export class BrightessContrastFilter extends AbstractGlFilter{

    private readonly u_contrast: string;
    private readonly u_brightness: string;

    constructor(game:Game){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.u_contrast = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_contrast');
        this.u_brightness = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_brightness');
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec4 pixelColor = texture2D(texture, v_texCoord);
                // Apply contrast.
                pixelColor.rgb = ((pixelColor.rgb - 0.5) * max(u_contrast, 0.)) + 0.5;

                // Apply brightness.
                pixelColor.rgb += u_brightness;

                // Return final pixel color.
                pixelColor.rgb *= pixelColor.a;
                gl_FragColor = pixelColor;
            }
        `);
        this.setBrightness(0);
        this.setContrast(0);
        this.simpleRectDrawer.initProgram();
    }


    public setContrast(c:number):void{
        this.setUniform(this.u_contrast,c);
    }

    public setBrightness(b:number):void{
        this.setUniform(this.u_brightness,b);
    }

}

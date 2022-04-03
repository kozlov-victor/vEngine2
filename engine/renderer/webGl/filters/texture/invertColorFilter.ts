import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {ShaderGenerator} from "../../shaderGenerator/shaderGenerator";
import {Game} from "@engine/core/game";

export class InvertColorFilter extends AbstractGlFilter{

    constructor(game:Game){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec4 col = texture2D(texture, v_texCoord);
                gl_FragColor.rgb = 1.-col.rgb;
                gl_FragColor.a = col.a;
            }
        `);
        this.simpleRectPainter.initProgram();
    }

}

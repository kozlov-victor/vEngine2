import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";


// from https://github.com/daviestar/glfx-es6/blob/master/src/filters/adjust/vignette.js with adaptations to the engine
// size     0 to 1 (0 for center of frame, 1 for edge of frame)
// amount   0 to 1 (0 for no effect, 1 for maximum lens darkening)

export class VignetteFilter extends AbstractGlFilter{

    private readonly size:string;
    private readonly amount:string;

    constructor(game:Game){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.size = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'size');
        this.amount = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'amount');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main() {
                vec4 color = texture2D(texture, v_texCoord);

                float dist = distance(v_texCoord, vec2(0.5, 0.5));
                color.rgb *= smoothstep(0.8, size * 0.799, dist * (amount + size));
                gl_FragColor = color;
            }
        `);
        this.setSize(0.2);
        this.setAmount(0.8);
        this.simpleRectPainter.initProgram();
    }

    public setSize(val:number):void {
        this.setUniform(this.size,val);
    }

    public setAmount(val:number):void {
        this.setUniform(this.amount,val);
    }


}

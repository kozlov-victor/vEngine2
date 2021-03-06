import {AbstractAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/abstract/abstractAccumulativeFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class FadeAccumulativeFilter extends AbstractAccumulativeFilter {

    private readonly u_fadeValue:string;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.u_fadeValue = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT, 'u_fadeValue');
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec4 colorOrig = texture2D(texture, v_texCoord);
                gl_FragColor = colorOrig;
                gl_FragColor.r-=u_fadeValue;
                gl_FragColor.g-=u_fadeValue;
                gl_FragColor.b-=u_fadeValue;
                gl_FragColor.a-=u_fadeValue;
            }`
        );
        this.setFadeValue(0.01);
        this.simpleRectDrawer.initProgram();
    }

    public setFadeValue(val:number):void{
        this.simpleRectDrawer.setUniform(this.u_fadeValue,val);
    }

}

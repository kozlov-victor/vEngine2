import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Game} from "@engine/core/game";

// http://evanw.github.io/webgl-filter/

export class TriangleBlurFilter extends AbstractGlFilter {

    private readonly delta:string;
    private readonly valArr:Float32Array = new Float32Array([0,0]);


    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.delta = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'delta');

        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec2 texCoord = v_texCoord;
                vec4 color=vec4(0.0);
                float total=0.0;
                float offset=0.01;// random
                for (float t=-30.0;t<=30.0;t++){
                    float percent=(t+offset-0.5)/30.0;
                    float weight=1.0-abs(percent);
                    vec4 sampl=texture2D(texture, texCoord+delta*percent);
                    sampl.rgb*=sampl.a;
                    color+=sampl*weight;
                    total+=weight;
                }
                gl_FragColor=color/total;
                gl_FragColor.rgb/=gl_FragColor.a+0.00001;
            }
        `);
        this.setValue(0.025);
        this.simpleRectDrawer.initProgram();
    }

    // 0...1
    public setValue(val:number):void{
        this.valArr[0] = this.valArr[1] = val;
        this.setUniform(this.delta,this.valArr);
    }


}

import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {Game} from "@engine/core/game";
import {AbstractAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/abstract/abstractAccumulativeFilter";

export class SimpleAccumulativeFilter extends AbstractAccumulativeFilter {

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                gl_FragColor = texture2D(texture, v_texCoord);
            }`
        );
        this.simpleRectPainter.initProgram();
    }


}

import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";


export class InvertBgColorCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
        //language=GLSL
        this.simpleRectPainter.gen.setFragmentMainFn(`
            void main(){
                vec4 destColor = texture2D(destTexture, v_texCoord);
                vec4 sourceColor = texture2D(texture, v_texCoord);
                if (destColor.a==0. && sourceColor.a>0.) gl_FragColor = sourceColor;
                if (destColor.a>0. && sourceColor.a==0.) gl_FragColor = destColor;
                else gl_FragColor = 1.-destColor;
            }`
        );
        this.simpleRectPainter.initProgram();
    }

}

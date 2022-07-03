import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

// just copy destination to source,
// use to combine with other filters
export class CopyDestCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
        this.clearNextFrameBuffer = false;
        //language=GLSL
        this.simpleRectPainter.gen.setFragmentMainFn(`
            void main(){
                vec4 destColor = texture2D(destTexture, v_texCoord);
                vec4 sourceColor = texture2D(texture, v_texCoord);
                gl_FragColor = destColor;
            }`
        );
        this.simpleRectPainter.initProgram();
    }

}

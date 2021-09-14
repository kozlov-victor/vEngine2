import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation

// The pixels are inverted, multiplied, and inverted again.
export class ScreenCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
        //language=GLSL
        this.simpleRectDrawer.gen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec4 destColor = vec4(1.) - texture2D(destTexture, v_texCoord);
                vec4 sourceColor = vec4(1.) - texture2D(texture, v_texCoord);
                gl_FragColor = vec4(1.) - destColor*sourceColor;
            }`
        );
        this.simpleRectDrawer.initProgram();
    }

}

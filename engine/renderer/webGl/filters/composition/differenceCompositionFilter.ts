import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

// https://www.w3.org/TR/compositing-1/#valdef-blend-mode-difference

// Retains the darkest pixels of both layers
export class DifferenceCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
        //language=GLSL
        this.simpleRectPainter.gen.setFragmentMainFn(`
            void main() {
                vec4 destColor = texture2D(destTexture, v_texCoord);
                vec4 sourceColor = texture2D(texture, v_texCoord);
                if (destColor.a==0. && sourceColor.a>0.) gl_FragColor = sourceColor;
                else if (destColor.a>0. && sourceColor.a==0.) gl_FragColor = destColor;
                else gl_FragColor = destColor*sourceColor;
            }`
        );
        this.simpleRectPainter.initProgram();
    }

    protected getBlendFunctionCode(): string {
        //language=GLSL
        return `
            vec4 blend(vec4 destColor,vec4 sourceColor) {
                return abs(destColor - sourceColor);
            }
        `
    }

}

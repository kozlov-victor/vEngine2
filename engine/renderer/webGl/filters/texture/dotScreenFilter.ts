import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {Game} from "@engine/core/game";
import {GL_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/buffer/frameBuffer";

// https://github.com/spite/Wagner/blob/master/fragment-shaders/dot-screen-fs.glsl


export class DotScreenFilter extends AbstractGlFilter {

    private readonly texSize:string;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.texSize = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'texSize');
        //language=GLSL
        programGen.setFragmentMainFn(`
            vec2 center = .5 * texSize;
            float angle = 1.57;
            float scale = 1.;

            float pattern() {
                float s = sin(angle), c = cos(angle);
                vec2 tex = v_texCoord * texSize - center;
                vec2 point = vec2(c * tex.x - s * tex.y, s * tex.x + c * tex.y) * scale;
                return (sin(point.x) * sin(point.y)) * 4.0;
            }

            void main() {
                vec4 color = texture2D(texture, v_texCoord);
                float average = (color.r + color.g + color.b) / 3.0;
                gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);
            }

            `
        );
        this.simpleRectPainter.initProgram();
    }

    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const sizeArr:Float32Array = this.simpleRectPainter.getAttachedTextureAt(0).size.toArray();
        this.setUniform(this.texSize,sizeArr);
        super.doFilter(destFrameBuffer);
    }

}

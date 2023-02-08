import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {Game} from "@engine/core/game";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

// https://github.com/spite/Wagner/blob/master/fragment-shaders/rgb-split-fs.glsl

//language=GLSL
const fs = `
void main() {
        float r = texture2D(texture, v_texCoord.xy).r;
        float a = texture2D(texture, v_texCoord.xy).a;
        float g = texture2D(texture, vec2(v_texCoord.x+delta.x/texSize.x,v_texCoord.y)).g;
        float b = texture2D(texture, vec2(v_texCoord.x,v_texCoord.y+delta.y/texSize.y)).b;
        gl_FragColor = vec4(r,g,b,a);
    }
`

export class RgbSplitFilter extends AbstractGlFilter {

    private readonly texSize:string;
    private readonly delta:string;
    private deltaArr = new Float32Array(2);

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.texSize = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'texSize');
        this.delta = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'delta');
        programGen.setFragmentMainFn(fs);
        this.simpleRectPainter.initProgram();
        this.setOffset(5,5);
    }

    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const sizeArr:Float32Array = this.simpleRectPainter.getAttachedTextureAt(0).size.toArray();
        this.setUniform(this.texSize,sizeArr);
        super.doFilter(destFrameBuffer);
    }

    public setOffset(x:number,y:number):this {
        this.deltaArr[0] = x;
        this.deltaArr[1] = y;
        this.setUniform(this.delta,this.deltaArr);
        return this;
    }

}

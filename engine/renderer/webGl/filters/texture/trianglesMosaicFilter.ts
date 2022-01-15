import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

// from https://www.construct.net/en/forum/extending-construct-2/effects-31/effect-triangles-mosaic-116362 with adaptation to the engine
export class TrianglesMosaicFilter extends AbstractGlFilter{

    private sizeArr:Float32Array = new Float32Array([0,0]);
    private readonly tileSize:string;

    constructor(game:Game){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.tileSize = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'tileSize');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main()
            {
                vec2 uv = v_texCoord;
                vec2 uv2 = floor(uv*tileSize)/tileSize;
                uv -= uv2;
                uv *= tileSize;
                gl_FragColor = texture2D(texture, uv2 + vec2(step(1.0-uv.y, uv.x)/(2.0*tileSize.x), step(uv.x, uv.y)/(2.0*tileSize.y)));
            }
        `);
        this.setMosaicTileSize(40,40);
        this.simpleRectPainter.initProgram();
    }

    public setMosaicTileSize(x:number,y:number):void {
        this.sizeArr[0] = x;
        this.sizeArr[1] = y;
        this.setUniform(this.tileSize,this.sizeArr);
    }


}

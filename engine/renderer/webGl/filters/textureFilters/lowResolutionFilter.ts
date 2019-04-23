import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/game";
import {Size} from "@engine/geometry/size";

// https://clemz.io/article-retro-shaders-webgl.html


export class LowResolutionFilter extends AbstractFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_resolution:string;

    constructor(game:Game) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.rt_w = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_resolution = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_resolution');

        //language=GLSL
        programGen.appendFragmentCodeBlock(`
            vec4 lowResolution(vec2 uv) {
                // New resolution of (nx / ny)
                float nx = rt_w * u_resolution;
                float ny = floor(nx / u_resolution);

                vec2 pos;
                pos.x = floor(uv.x * nx) / nx;
                pos.y = floor(uv.y * ny) / ny;
                return texture2D(texture, pos);
            }
        `);
        //language=GLSL
        programGen.setFragmentMainFn(`
                void main(){
                    vec2 uv = vec2(gl_FragCoord.xy / vec2(rt_w,rt_h));
                    gl_FragColor = lowResolution(uv);
                }
            `
        );
        this.simpleRectDrawer.initProgram();
        this.setResolution(0.1);
    }

    setResolution(val:number):void{
        this.setUniform(this.u_resolution,val);
    }


    doFilter(destFrameBuffer:FrameBuffer):void{
        const size:Size = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,size.width);
        this.setUniform(this.rt_h,size.height);
        super.doFilter(destFrameBuffer);
    }

}
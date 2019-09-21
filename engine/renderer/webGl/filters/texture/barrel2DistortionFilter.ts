import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/core/game";

// https://prideout.net/barrel-distortion


export class Barrel2DistortionFilter extends AbstractFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_distortion:string;

    constructor(game:Game) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.rt_w = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_distortion = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_distortion');

        //language=GLSL
        programGen.appendFragmentCodeBlock(MACRO_GL_COMPRESS`
            // https://prideout.net/barrel-distortion
            // Given a vec2 in [-1,+1], generate a texture coord in [0,+1]
            vec2 distort(vec2 p)
            {
                float theta  = atan(p.y, p.x);
                float radius = length(p);
                radius = pow(radius, u_distortion);
                p.x = radius * cos(theta);
                p.y = radius * sin(theta);
                return 0.5 * (p + 1.0);
            }
            
        `);
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec2 uv = vec2(gl_FragCoord.xy / vec2(rt_w,rt_h));
                vec2 distorted = distort(uv*2.0 - 1.0);
                gl_FragColor = texture2D(texture, distorted);
            }
            `
        );
        this.simpleRectDrawer.initProgram();
        this.setDistortion(1.1);
    }

    public setDistortion(val:number):void{
        this.setUniform(this.u_distortion,val);
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{
        const {width,height} = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,width);
        this.setUniform(this.rt_h,height);
        super.doFilter(destFrameBuffer);
    }

}
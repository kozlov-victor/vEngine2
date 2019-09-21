import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/core/game";

// https://www.geeks3d.com/20140213/glsl-shader-library-fish-eye-and-dome-and-barrel-distortion-post-processing-filters/6/


export class LensDistortionFilter extends AbstractFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_mouse:string;
    private readonly u_length_size:string;
    private readonly u_force:string;

    private readonly coordinates:[number,number] = [0,0];

    constructor(game:Game) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.rt_w = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_mouse = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'u_mouse');
        this.u_force = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_force');
        this.u_length_size = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_length_size');

        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            
            void main() {

                vec2 resolution = vec2(rt_w,rt_h);
                float aspect = resolution.y / resolution.y;
                vec2 scale = vec2(aspect, 1.);
                
                vec2 p = v_texCoord.xy;
                vec2 m = u_mouse.xy / resolution.xy;
                
                
                float r = length((p-m)); // distance of pixel from mouse
                
                vec4 col;
                if (r > u_length_size) {
                    col = texture2D(texture, v_texCoord);
                }
                else {
                    vec2 displace = m+(p-m)*(r-u_force)/r;
                    col = texture2D(texture, displace);
                }
                gl_FragColor = col;
            }
            `
        );
        this.simpleRectDrawer.initProgram();
        this.setLengthSize(0.2);
        this.setForce(0.02);
    }

    public setLengthSize(val:number):void{
        this.setUniform(this.u_length_size,val);
    }

    public setForce(val:number):void{
        this.setUniform(this.u_force,val);
    }

    public setMouseScreenCoordinates(x:number,y:number):void{
        this.coordinates[0] = x;
        this.coordinates[1] = y;
        this.setUniform(this.u_mouse,this.coordinates);
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{
        const {width,height} = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,width);
        this.setUniform(this.rt_h,height);

        super.doFilter(destFrameBuffer);
    }

}
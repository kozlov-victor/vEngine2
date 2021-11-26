import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";

// https://www.geeks3d.com/20140213/glsl-shader-library-fish-eye-and-dome-and-barrel-distortion-post-processing-filters/6/


export class LensDistortionFilter extends AbstractGlFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_mouse:string;
    private readonly u_length_size:string;
    private readonly u_force:string;

    private readonly coordinates:Float32Array = new Float32Array([0,0]);

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.rt_w = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_mouse = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'u_mouse');
        this.u_force = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_force');
        this.u_length_size = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_length_size');

        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`

            void main() {

                vec2 resolution = vec2(rt_w,rt_h);
                vec2 pointScreen = v_texCoord.xy*resolution;
                vec2 mouseSceen = u_mouse.xy;

                vec2 point = v_texCoord.xy;
                vec2 mouse = u_mouse.xy/resolution;

                // distance of pixel from mouse
                float rScreen = length(pointScreen-mouseSceen);
                float r = length(point-mouse);

                vec4 col;
                if (rScreen > u_length_size) {
                    col = texture2D(texture, v_texCoord);
                }
                else {
//                    float r2=r-u_force;
//                    if (r2<0.) r2=0.;
//                    vec2 displace = mouse+(point-mouse)*(r2)/r;
                    vec2 delta = point-mouse;
                    float teta = atan(delta.y,delta.x);
                    float r2 = pow(r, u_force);
                    float dx = point.x+r2*cos(teta);
                    float dy = point.y+r2*sin(teta);
                    col = texture2D(texture, vec2(dx,dy));
                }
                gl_FragColor = col;
            }
            `
        );
        this.setLengthSize(50);
        this.setForce(2);
        this.simpleRectPainter.initProgram();
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

    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const size:ISize = this.simpleRectPainter.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,size.width);
        this.setUniform(this.rt_h,size.height);

        super.doFilter(destFrameBuffer);
    }

}

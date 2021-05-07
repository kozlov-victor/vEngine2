import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {Game} from "@engine/core/game";
import {AbstractAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/abstract/abstractAccumulativeFilter";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";

export type Kernel3x3 = [
    number,number,number,
    number,number,number,
    number,number,number
];

export class AbstractKernelAccumulativeFilter extends AbstractAccumulativeFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_kernel:string;
    private readonly u_kernelWeight:string;
    private readonly u_noiseIntensity:string;
    private readonly u_time:string;

    private kernel:Kernel3x3;
    private kernelWeight:number = 0;
    private noiseIntensity:number = 0;
    private time:number = 0;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        // https://webglfundamentals.org/webgl/lessons/ru/webgl-image-processing-continued.html
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio
            float rand(vec2 xy,float seed) {
                return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
            }
            void main(){
                vec2 onePixel = vec2(1.0, 1.0) / vec2(rt_w,rt_h);
                vec4 colorSum =
                    texture2D(texture, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
                    texture2D(texture, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
                    texture2D(texture, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
                gl_FragColor = vec4((colorSum / (u_kernelWeight + rand(gl_FragCoord.xy,u_time)*u_noiseIntensity)));
            }`
        );
        this.rt_w = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_kernel = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_kernel[9]',true);
        this.u_kernelWeight = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_kernelWeight');
        this.u_noiseIntensity = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_noiseIntensity');
        this.u_time = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_time');
        this.setKernel([0,0,0,0,0,0,0,0,0]);
        this.simpleRectDrawer.initProgram();
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{
        const {width,height} = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,width);
        this.setUniform(this.rt_h,height);
        this.setUniform(this.u_kernel,new Float32Array(this.kernel));
        this.setUniform(this.u_kernelWeight,this.kernelWeight);
        this.setUniform(this.u_noiseIntensity,this.noiseIntensity);
        this.time+=0.01;
        this.setUniform(this.u_time,this.time);
        super.doFilter(destFrameBuffer);
    }

    public setKernel(kernel:Kernel3x3):void{
        this.kernel = kernel;
        this.kernelWeight = 0;
        this.kernel.forEach(it=>this.kernelWeight+=it);
    }

    public setNoiseIntensity(intensity:number):void{
        this.noiseIntensity = intensity;
    }

}

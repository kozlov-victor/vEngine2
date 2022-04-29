import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {Game} from "@engine/core/game";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {Kernel3x3} from "@engine/renderer/webGl/filters/accumulative/abstract/abstractKernelAccumulativeFilter";


export abstract class AbstractKernelAccumulativeFilter extends AbstractGlFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_kernel:string;
    private readonly u_kernelWeight:string;
    private kernelWeight:number = 0;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        // https://webglfundamentals.org/webgl/lessons/ru/webgl-image-processing-continued.html
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec2 onePixel = vec2(1.0, 1.0) / vec2(rt_w,rt_h);
                float a = texture2D(texture, v_texCoord).a;
                vec4 colorSum =
                    texture2D(texture, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
                    texture2D(texture, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
                    texture2D(texture, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
                    texture2D(texture, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8];
                gl_FragColor = vec4((colorSum / u_kernelWeight).rgb,a);
            }`
        );
        this.rt_w = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_kernel = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_kernel[9]',true);
        this.u_kernelWeight = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_kernelWeight');
        this.setKernel([0,0,0,0,0,0,0,0,0]);
        this.simpleRectPainter.initProgram();
    }

    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const {width,height} = this.simpleRectPainter.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,width);
        this.setUniform(this.rt_h,height);
        this.setUniform(this.u_kernelWeight,this.kernelWeight);
        super.doFilter(destFrameBuffer);
    }

    public setKernel(kernel:Kernel3x3):void{
        this.kernelWeight = 0;
        this.setUniform(this.u_kernel,new Float32Array(kernel));
        kernel.forEach(it=>this.kernelWeight+=it);
        if (this.kernelWeight<=0) this.kernelWeight = 1;
    }

}

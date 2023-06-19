import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/buffer/frameBuffer";

// https://github.com/Drigax/RooftopRampage_Source/blob/master/public/Shaders/crt.fragment.fx
export class CrtScreenFilter extends AbstractGlFilter {

    private readonly curvature:string;
    private readonly screenResolution:string;
    private readonly scanLineOpacity:string;
    private readonly vignetteOpacity:string;
    private readonly brightness:string;
    private readonly vignetteRoundness:string;
    private readonly rt_w:string;
    private readonly rt_h:string;

    constructor(game:Game) {
        super(game);

        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.curvature = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'curvature');
        this.rt_w = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.scanLineOpacity = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'scanLineOpacity');
        this.vignetteOpacity = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'vignetteOpacity');
        this.brightness = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'brightness');
        this.vignetteRoundness = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'vignetteRoundness');
        //language=GLSL
        programGen.setFragmentMainFn(`

            #define PI 3.1415926538

            vec2 curveRemapUV(vec2 uv){
                // as we near the edge of our screen apply greater distortion using a sinusoid.

                uv = uv * 2.0 - 1.0;
                vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
                uv = uv + uv * offset * offset;
                uv = uv * 0.5 + 0.5;
                return uv;
            }

            vec4 scanLineIntensity(float uv, float resolution, float opacity){
                float intensity = sin(uv * resolution * PI * 2.0);
                intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
                return vec4(vec3(pow(intensity, opacity)), 1.0);
            }

            vec4 vignetteIntensity(vec2 uv, vec2 resolution, float opacity, float roundness){
                float intensity = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
                return vec4(vec3(clamp(pow((resolution.x / roundness) * intensity, opacity), 0.0, 1.0)), 1.0);
            }

            void main(void){
                vec2 uv = v_texCoord.xy;
                vec2 remappedUV = curveRemapUV(vec2(uv.x, uv.y));
                vec4 baseColor = texture2D(texture, remappedUV);

                vec2 screenResolution = vec2(rt_w,rt_h);
                baseColor *= vignetteIntensity(remappedUV, screenResolution, vignetteOpacity, vignetteRoundness);

                baseColor *= scanLineIntensity(remappedUV.x, screenResolution.y, scanLineOpacity.x);
                baseColor *= scanLineIntensity(remappedUV.y, screenResolution.x, scanLineOpacity.y);

                baseColor *= vec4(vec3(brightness), 1.0);

                if (remappedUV.x < 0.0 || remappedUV.y < 0.0 || remappedUV.x > 1.0 || remappedUV.y > 1.0){
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                } else {
                    gl_FragColor = baseColor;
                }
            }

            `
        );
        this.setCurvature(4.0,4.0);
        this.setVignetteLineOpacity(1);
        this.setScanLineOpacity(0.05,0.01);
        this.setVignetteRoundness(1);
        this.setBrightness(1);
        this.simpleRectPainter.initProgram();
    }

    public setCurvature(x:number,y:number):this {
        const arr = new Float32Array([x,y]);
        this.setUniform(this.curvature,arr);
        return this;
    }

    public setScanLineOpacity(x:number,y:number):this {
        const arr = new Float32Array([x,y]);
        this.setUniform(this.scanLineOpacity,arr);
        return this;
    }

    public setVignetteLineOpacity(val:number):this {
        this.setUniform(this.vignetteOpacity,val);
        return this;
    }

    public setVignetteRoundness(val:number):this {
        this.setUniform(this.vignetteRoundness,val);
        return this;
    }

    public setBrightness(val:number):this {
        this.setUniform(this.brightness,val);
        return this;
    }

    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const {width,height} = this.simpleRectPainter.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,width);
        this.setUniform(this.rt_h,height);
        super.doFilter(destFrameBuffer);
    }


}

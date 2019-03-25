
import {AbstractFilter} from "@engine/core/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/core/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/core/renderer/webGl/base/shaderProgramUtils";
import {TextureInfo} from "@engine/core/renderer/webGl/programs/abstract/abstractDrawer";
import {FrameBuffer} from "@engine/core/renderer/webGl/base/frameBuffer";

// https://clemz.io/article-retro-shaders-webgl.html


export class BarrelDistortionFilter extends AbstractFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_distortion:string;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.rt_w = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_distortion = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_distortion');

        //language=GLSL
        programGen.appendFragmentCodeBlock(`
            vec4 barrel(vec2 uv) {
                vec2 pos = uv;
                pos -= vec2(0.5, 0.5);
                pos *= vec2(pow(length(pos), u_distortion));
                pos += vec2(0.5, 0.5);
                return texture2D(texture, pos);
            }
        `);
        //language=GLSL
        programGen.setFragmentMainFn(`
                    void main(){
                        vec2 uv = vec2(gl_FragCoord.xy / vec2(rt_w,rt_h));
                        gl_FragColor = barrel(uv);
                    }
            `
        );
        this.simpleRectDrawer.initProgram();
        this.setDistortion(0.1);
    }

    setDistortion(val:number){
        this.setUniform(this.u_distortion,val);
    }

    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        this.setUniform(this.rt_w,textureInfos[0].texture.size.width);
        this.setUniform(this.rt_h,textureInfos[0].texture.size.height);
        super.doFilter(textureInfos,destFrameBuffer);
    }

}
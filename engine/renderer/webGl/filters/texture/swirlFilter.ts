import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Game} from "@engine/core/game";

// http://evanw.github.io/webgl-filter/

export class SwirlFilter extends AbstractGlFilter {

    private readonly center:string;
    private readonly angle:string;
    private readonly radius:string;
    private readonly texSize:string;

    private readonly centerArr:[number,number] = [0,0];

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.angle = programGen.addFragmentUniform(GL_TYPE.FLOAT,'angle');
        this.radius = programGen.addFragmentUniform(GL_TYPE.FLOAT,'radius');
        this.center = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'center');
        this.texSize = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'texSize');


        //language=GLSL
        programGen.appendFragmentCodeBlock(`            
            
        `);
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
                    void main(){
                        vec2 texCoord = v_texCoord;
                        vec2 coord=texCoord*texSize;
                        coord-=center;
                        float distance=length(coord);
                        if(distance<radius){
                            float percent=(radius-distance)/radius;
                            float theta=percent*percent*angle;
                            float s=sin(theta);
                            float c=cos(theta);
                            coord=vec2(coord.x*c-coord.y*s,coord.x*s+coord.y*c);
                        }
                        coord+=center;
                        gl_FragColor=texture2D(texture,coord/texSize);
                    }
        `);
        this.setAngle(2*Math.PI);
        this.setRadius(100);
        this.simpleRectDrawer.initProgram();
    }


    public setRadius(val:number):void{
        this.setUniform(this.radius,val);
    }

    public setAngle(val:number):void{
        this.setUniform(this.angle,val);
    }


    public doFilter(destFrameBuffer:FrameBuffer):void{
        const sizeArr:[number,number] = this.simpleRectDrawer.getAttachedTextureAt(0).size.toArray();
        this.setUniform(this.texSize,sizeArr);
        this.centerArr[0] = sizeArr[0]/2;
        this.centerArr[1] = sizeArr[1]/2;
        this.setUniform(this.center,this.centerArr);
        super.doFilter(destFrameBuffer);
    }


}
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Game} from "@engine/core/game";

// http://evanw.github.io/webgl-filter/

export class SwirlFilter extends AbstractGlFilter {

    private readonly center:string;
    private readonly angle:string;
    private readonly radius:string;
    private readonly texSize:string;

    private readonly centerArr:Float32Array = new Float32Array([0,0]);

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.angle = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'angle');
        this.radius = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'radius');
        this.center = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'center');
        this.texSize = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'texSize');


        //language=GLSL
        programGen.setFragmentMainFn(`
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
        this.setCenter(this.game.size.width/2,this.game.size.height/2);
        this.simpleRectPainter.initProgram();
    }


    public setRadius(val:number):this{
        this.setUniform(this.radius,val);
        return this;
    }

    public setAngle(val:number):this{
        this.setUniform(this.angle,val);
        return this;
    }

    public setCenter(x:number,y:number):this{
        this.centerArr[0] = x;
        this.centerArr[1] = y;
        this.setUniform(this.center,this.centerArr);
        return this;
    }


    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const sizeArr:Float32Array = this.simpleRectPainter.getAttachedTextureAt(0).size.toArray();
        this.setUniform(this.texSize,sizeArr);
        super.doFilter(destFrameBuffer);
    }


}

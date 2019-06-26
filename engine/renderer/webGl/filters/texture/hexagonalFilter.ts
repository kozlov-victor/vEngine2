import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Game} from "@engine/game";

// http://evanw.github.io/webgl-filter/

export class HexagonalFilter extends AbstractFilter {

    private readonly center:string;
    private readonly scale:string;
    private readonly texSize:string;

    constructor(game:Game) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.scale = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'scale');
        this.center = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'center');
        this.texSize = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'texSize');

        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec2 texCoord = v_texCoord;
                vec2 tex=(texCoord*texSize-center)/scale;
                tex.y/=0.866025404;
                tex.x-=tex.y*0.5;
                vec2 a;
                if(tex.x+tex.y-floor(tex.x)-floor(tex.y)<1.0)a=vec2(floor(tex.x),floor(tex.y));
                else a=vec2(ceil(tex.x),ceil(tex.y));
                vec2 b=vec2(ceil(tex.x),floor(tex.y));
                vec2 c=vec2(floor(tex.x),ceil(tex.y));
                vec3 TEX=vec3(tex.x,tex.y,1.0-tex.x-tex.y);
                vec3 A=vec3(a.x,a.y,1.0-a.x-a.y);
                vec3 B=vec3(b.x,b.y,1.0-b.x-b.y);
                vec3 C=vec3(c.x,c.y,1.0-c.x-c.y);
                float alen=length(TEX-A);
                float blen=length(TEX-B);
                float clen=length(TEX-C);
                vec2 choice;
                if(alen<blen){if(alen<clen)choice=a;else choice=c;}
                else{if(blen<clen)choice=b;else choice=c;}
                choice.x+=choice.y*0.5;
                choice.y*=0.866025404;
                choice*=scale/texSize;
                gl_FragColor=texture2D(texture,choice+center/texSize);
            }
        `);
        this.simpleRectDrawer.initProgram();
        this.setSize(10);
        this.setUniform(this.center,[0.5,0.5]);
    }


    public setSize(val:number):void {
        this.setUniform(this.scale,[val,val]);
    }


    public doFilter(destFrameBuffer:FrameBuffer):void{
        this.setUniform(this.texSize,this.simpleRectDrawer.getAttachedTextureAt(0).size.toArray());
        super.doFilter(destFrameBuffer);
    }


}
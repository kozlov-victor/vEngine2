import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Game} from "@engine/core/game";
import {Size} from "@engine/geometry/size";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Color} from "@engine/renderer/common/color";

// https://codepen.io/mishaa/pen/raKzrm

export class GlowFilter extends AbstractGlFilter {

    private readonly distance:string;
    private readonly outerStrength:string;
    private readonly innerStrength:string;
    private readonly glowColor:string;
    private readonly pixelWidth:string;
    private readonly pixelHeight:string;


    constructor(game:Game,private quality:number = 0.03 /*[0..1]*/,private dist:number = 25) {
        // warn! quality=1 could produce a lack of performance
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;

        this.quality = Math.pow(this.quality, 1/3);
        this.dist *= this.quality;

        this.distance = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'distance');
        this.outerStrength = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'outerStrength');
        this.innerStrength = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'innerStrength');
        this.pixelWidth = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'pixelWidth');
        this.pixelHeight = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'pixelHeight');
        this.glowColor = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC4,'glowColor');

        //language=GLSL
        programGen.setFragmentMainFn(`
            #define PI ${Math.PI}
            vec2 px = vec2(pixelWidth, pixelHeight);
            void main(void) {
                vec4 ownColor = texture2D(texture, v_texCoord);
                vec4 curColor;
                float totalAlpha = 0.;
                float maxTotalAlpha = 0.;
                float cosAngle;
                float sinAngle;
                for (float angle = 0.; angle <= PI * 2.; angle += ${(1 / this.quality / this.dist).toFixed(7)}) {
                   cosAngle = cos(angle);
                   sinAngle = sin(angle);
                   for (float curDistance = 1.; curDistance <= ${this.dist.toFixed(7)}; curDistance++) {
                       curColor = texture2D(texture, vec2(v_texCoord.x + cosAngle * curDistance * px.x, v_texCoord.y + sinAngle * curDistance * px.y));
                       totalAlpha += (distance - curDistance) * curColor.a;
                       maxTotalAlpha += (distance - curDistance);
                   }
                }
                maxTotalAlpha = max(maxTotalAlpha, 0.0001);

                ownColor.a = max(ownColor.a, 0.0001);
                ownColor.rgb = ownColor.rgb / ownColor.a;
                float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);
                float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;
                float resultAlpha = (ownColor.a + outerGlowAlpha);
                gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);
            }
        `);
        this.setInnerStrength(1);
        this.setOuterStrength(4);
        this.setGlowColor(Color.WHITE);
        this.setDistance(this.dist);
        this.simpleRectPainter.initProgram();
    }

    public setInnerStrength(n:number):void{
        this.setUniform(this.innerStrength,n);
    }

    public setOuterStrength(n:number):void{
        this.setUniform(this.outerStrength,n);
    }

    public setGlowColor(c:Color):void{
        this.setUniform(this.glowColor,c.asGL());
    }

    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const size:Size = this.simpleRectPainter.getAttachedTextureAt(0).size;
        this.setUniform(this.pixelWidth,1/(size.width*this.quality));
        this.setUniform(this.pixelHeight,1/(size.height*this.quality));
        super.doFilter(destFrameBuffer);
    }

    private setDistance(n:number):void{
        this.setUniform(this.distance,n);
    }


}

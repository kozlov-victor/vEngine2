import {ICloneable} from "@engine/core/declarations";
import {MathEx} from "@engine/misc/math/mathEx";
import {AbstractGradient, IGradientPoint} from "@engine/renderable/impl/fill/abstract/abstractGradient";
import {ShapePainter} from "@engine/renderer/webGl/programs/impl/base/shape/shapePainter";
import {Color} from "@engine/renderer/common/color";


export class LinearGradient extends AbstractGradient implements ICloneable<LinearGradient>{

    public type:string = 'LinearGradient';

    public angle:number = 0.1;

    public override set(g:LinearGradient):void{
        super.set(g);
        this.angle = g.angle;
    }

    public asCSS():string{
        return `linear-gradient(${~~(MathEx.radToDeg(-this.angle))+90}deg, ${this._points.map(it=>`${it.color.asCssRgba()} ${~~(it.value*100)}%`).join(',')}`;
    }

    public override setUniforms(sd: ShapePainter):void {
        super.setUniforms(sd);
        sd.setUniform(sd.u_fillGradientAngle,this.angle);
    }

    public fromJSON(params:{points:IGradientPoint[],angle:number}):void{
        this._points = params.points.map(it=>({value: it.value, color: Color.from(it.color)}));
        this.angle = params.angle;
    }

    public toJSON():{points:IGradientPoint[],angle:number}{
        return {
            points: this._points.map(it=>({value:it.value,color: it.color.toJSON()})),
            angle: this.angle,
        };
    }

    public clone():this {
        const cloned:LinearGradient = new LinearGradient();
        cloned.fromJSON(this.toJSON());
        return cloned as this;
    }

}

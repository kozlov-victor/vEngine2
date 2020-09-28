import {ICloneable} from "@engine/core/declarations";
import {MathEx} from "@engine/misc/mathEx";
import {AbstractGradient} from "@engine/renderable/impl/fill/abstract/abstractGradient";
import {ShapeDrawer} from "@engine/renderer/webGl/programs/impl/base/shape/shapeDrawer";


export class LinearGradient extends AbstractGradient implements ICloneable<LinearGradient>{

    public type:string = 'LinearGradient';

    public angle:number = 0.1;

    public set(g:LinearGradient):void{
        this._points = [...g._points.map(it=>({...it}))];
        this.angle = g.angle;
    }

    public asCSS():string{
        return `linear-gradient(${~~(MathEx.radToDeg(-this.angle))+90}deg, ${this._points.map(it=>`${it.color.asCSS()} ${~~(it.value*100)}%`).join(',')}`;
    }


    setUniforms(sd: ShapeDrawer) {
        super.setUniforms(sd);
        sd.setUniform(sd.u_fillGradientAngle,this.angle);
    }

    public clone():LinearGradient {
        const cloned:LinearGradient = new LinearGradient();
        cloned.fromJSON(this.toJSON());
        return cloned;
    }

}

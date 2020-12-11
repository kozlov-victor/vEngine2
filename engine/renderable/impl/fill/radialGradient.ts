
// radial-gradient(at 12% 60%, red 0%, yellow 20%, green 100%);

import {AbstractGradient} from "@engine/renderable/impl/fill/abstract/abstractGradient";
import {Point2d} from "@engine/geometry/point2d";
import {ShapeDrawer} from "@engine/renderer/webGl/programs/impl/base/shape/shapeDrawer";

export class RadialGradient extends AbstractGradient {

    public type:string = 'RadialGradient';

    public readonly center:Point2d = new Point2d(0.5,0.5);

    asCSS(): string {
        return `radial-gradient(circle at ${this.center.x*100}% ${this.center.y*100}%, ${this._points.map(it=>`${it.color.asCSS()} ${~~(it.value*100)}%`).join(',')}`;
    }


    setUniforms(sd: ShapeDrawer):void {
        super.setUniforms(sd);
        sd.setUniform(sd.u_radialGradientCenterX,this.center.x);
        sd.setUniform(sd.u_radialGradientCenterY,this.center.y);
    }

    clone(): this {
        return undefined!;
    }


}

import {Color} from "@engine/renderer/common/color";
import {Optional} from "@engine/core/declarations";
import {ShapeDrawer} from "@engine/renderer/webGl/programs/impl/base/shape/shapeDrawer";

export interface IGradientPoint {
    value:number;
    color: IColor;
}

interface IGradientPointInternal {
    value:number; // 0..1
    color: Color;
}


export abstract class AbstractGradient {

    public static MAX_NUM_OF_GRADIENT_POINTS:number = 4;

    protected _points:IGradientPointInternal[] = [];
    private _arr:number[] = [];

    public fromJSON(points:IGradientPoint[]):void{
        this._points = points.map(it=>({value: it.value, color: Color.from(it.color)}));
    }

    public toJSON():IGradientPoint[]{
        return this._points.map(it=>({value:it.value,color: it.color.toJSON()}));
    }

    public setColorAtPosition(position:number,color:IColor):void {
        this._points.push({color:Color.from(color),value:position});
    }

    public setUniforms(sd:ShapeDrawer):void {
        for (let i:number=0; i<AbstractGradient.MAX_NUM_OF_GRADIENT_POINTS; i++) {
            const possibleColorPoint:Optional<IGradientPointInternal> = this._points[i];
            sd.setUniform(`u_fillGradientPoints[${i}].pointActive`,possibleColorPoint!==undefined);
            sd.setUniform(`u_fillGradientPoints[${i}].value`,possibleColorPoint?possibleColorPoint.value:0);
            sd.setUniform(`u_fillGradientPoints[${i}].r`,possibleColorPoint?possibleColorPoint.color.r/255:0);
            sd.setUniform(`u_fillGradientPoints[${i}].g`,possibleColorPoint?possibleColorPoint.color.g/255:0);
            sd.setUniform(`u_fillGradientPoints[${i}].b`,possibleColorPoint?possibleColorPoint.color.b/255:0);
            sd.setUniform(`u_fillGradientPoints[${i}].a`,possibleColorPoint?possibleColorPoint.color.a/255:0);
        }
    }

}

import {Color} from "@engine/renderer/common/color";
import {Optional} from "@engine/core/declarations";
import {ShapePainter} from "@engine/renderer/webGl/programs/impl/base/shape/shapePainter";
import {DebugError} from "@engine/debug/debugError";

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

    public abstract type:string;

    protected _points:IGradientPointInternal[] = [];

    public set(g:AbstractGradient):void{
        this._points = [...g._points.map(it=>({...it}))];
    }

    public setColorAtPosition(position:number,color:IColor):void {
        if (DEBUG && this._points.length>AbstractGradient.MAX_NUM_OF_GRADIENT_POINTS) {
            throw new DebugError(
                `Maxinum number of gradient points is ${AbstractGradient.MAX_NUM_OF_GRADIENT_POINTS},
                to use more points change AbstractGradient.MAX_NUM_OF_GRADIENT_POINTS before Game instance creation`);
        }
        this._points.push({color:Color.from(color),value:position});
    }

    public abstract asCSS():string;

    public abstract clone():this;

    public setUniforms(sd:ShapePainter):void {
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

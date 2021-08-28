import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Point2d} from "@engine/geometry/point2d";
import {Line} from "@engine/renderable/impl/geometry/line";
import {MathEx} from "@engine/misc/mathEx";

export const calcPolylineLength = (p:PolyLine):number=>{
    const zeroPoint:Point2d = new Point2d();
    let result:number = 0;
    p.getSegments().forEach((c:Readonly<Line>)=>{
        const length:number = MathEx.getDistance(zeroPoint,c.pointTo);
        result+=length;
    });
    return result;
};

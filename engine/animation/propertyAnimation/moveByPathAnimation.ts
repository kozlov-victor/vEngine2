import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Line} from "@engine/renderable/impl/geometry/line";
import {MathEx} from "@engine/misc/mathEx";
import {IPoint2d, Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {AbstractMoveAnimation} from "@engine/animation/propertyAnimation/abstract/abstractMoveAnimation";

interface IControlPoint {
    from:number;
    to:number;
    pointFrom:IPoint2d;
    pointTo:IPoint2d;
    length: number;
}

export class MoveByPathAnimation extends AbstractMoveAnimation {

    public velocity: number = 10;

    private controlPoints:IControlPoint[] = [];
    private totalLength:number = 0;

    private currentControlPointIndex:number = 0;

    constructor(protected game:Game,polyLine:PolyLine) {
        super(game);
        const zeroPoint:Point2d = new Point2d();
        polyLine.children.forEach((c:Line)=>{
            const length:number = MathEx.getDistance(zeroPoint,c.pointTo);
            this.controlPoints.push({
                length,
                pointFrom:c.pos,
                pointTo: {x:c.pos.x+c.pointTo.x,y:c.pos.y+c.pointTo.y},
                from:this.totalLength,
                to: this.totalLength + length
            });
            this.totalLength+=length;
        });
    }

    public reset(){
        super.reset();
        this.currentControlPointIndex = 0;
    }


    protected onUpdate(){
        const lengthPassed:number = this.velocity * this.passedTime / 1000;
        const point:IControlPoint = this.getCurrentControlPoint(lengthPassed);
        const lengthPassedRelative:number = lengthPassed - point.from;
        const passedFactor:number =
            point.length===0? 0: lengthPassedRelative/point.length;
        const x:number = point.pointFrom.x + (point.pointTo.x - point.pointFrom.x)*passedFactor;
        const y:number = point.pointFrom.y + (point.pointTo.y - point.pointFrom.y)*passedFactor;
        this.progressPoint.setXY(x,y);
        super.onUpdate();
        if (lengthPassed>=this.totalLength) {
            this.reset();
        }
    }

    private getCurrentControlPoint(lengthPassed:number):IControlPoint {
        let result:number = this.currentControlPointIndex;
        for (let i = this.currentControlPointIndex+1; i < this.controlPoints.length; i++) {
            const controlPoint = this.controlPoints[i];
            if (lengthPassed>=controlPoint.from) result = i;
        }
        this.currentControlPointIndex = result;
        return this.controlPoints[result];
    }

}

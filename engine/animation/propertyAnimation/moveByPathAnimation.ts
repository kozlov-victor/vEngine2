import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Line} from "@engine/renderable/impl/geometry/line";
import {MathEx} from "@engine/misc/mathEx";
import {IPoint2d, Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {AbstractMoveAnimation} from "@engine/animation/propertyAnimation/abstract/abstractMoveAnimation";
import {Optional} from "@engine/core/declarations";

interface IControlPoint {
    from:number;
    to:number;
    pointFrom:IPoint2d;
    pointTo:IPoint2d;
    length: number;
}

export class MoveByPathAnimation extends AbstractMoveAnimation {

    public velocity: number = 10;
    public durationSec:Optional<number>;

    private _controlPoints:IControlPoint[] = [];
    private _totalLength:number = 0;
    private _oldDurationSec:Optional<number>;

    private _currentControlPointIndex:number = 0;

    constructor(protected game:Game,polyLine:PolyLine) {
        super(game);
        const zeroPoint:Point2d = new Point2d();
        polyLine.children.forEach((c:Line)=>{
            const length:number = MathEx.getDistance(zeroPoint,c.pointTo);
            this._controlPoints.push({
                length,
                pointFrom:c.pos,
                pointTo: {x:c.pos.x+c.pointTo.x,y:c.pos.y+c.pointTo.y},
                from:this._totalLength,
                to: this._totalLength + length
            });
            this._totalLength+=length;
        });
    }

    public reset():void{
        super.reset();
        this._currentControlPointIndex = 0;
    }


    protected onUpdate():void{
        if (this.durationSec!==undefined && this.durationSec!==this._oldDurationSec) {
            this._oldDurationSec = this.durationSec;
            this.velocity = this._totalLength / this.durationSec;
        }
        const lengthPassed:number = this.velocity * this.passedTime / 1000;
        const point:IControlPoint = this.getCurrentControlPoint(lengthPassed);
        const lengthPassedRelative:number = lengthPassed - point.from;
        const passedFactor:number =
            point.length===0? 0: lengthPassedRelative/point.length;
        const x:number = point.pointFrom.x + (point.pointTo.x - point.pointFrom.x)*passedFactor;
        const y:number = point.pointFrom.y + (point.pointTo.y - point.pointFrom.y)*passedFactor;
        this.progressPoint.setXY(x,y);
        if (lengthPassed>=this._totalLength) {
            this.reset();
            this.numOfLoopPassed++;
        }
        super.onUpdate();
    }

    private getCurrentControlPoint(lengthPassed:number):IControlPoint {
        let result:number = this._currentControlPointIndex;
        for (let i = this._currentControlPointIndex+1; i < this._controlPoints.length; i++) {
            const controlPoint = this._controlPoints[i];
            if (lengthPassed>=controlPoint.from) result = i;
        }
        this._currentControlPointIndex = result;
        return this._controlPoints[result];
    }

}

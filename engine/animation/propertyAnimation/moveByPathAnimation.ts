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


export interface IPointAndAngle extends IPoint {
    angle:number;
}


class PointWithAngle extends Point2d implements IPointAndAngle{
    angle:number;
}

export class ControlPointByLengthPassedResolver {

    private _currentControlPointIndex:number = 0;
    private _controlPoints:IControlPoint[] = [];
    private _totalLength:number = 0;
    private point:PointWithAngle = new PointWithAngle();

    constructor(polyLine:PolyLine) {
        const zeroPoint:Point2d = new Point2d();
        polyLine.getSegments().forEach((c:Readonly<Line>)=>{
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

    private getCurrentControlPoint(lengthPassed:number):Optional<IControlPoint> {
        if (lengthPassed<0) return undefined;
        if (lengthPassed>this._totalLength) return undefined;

        let result:number = this._currentControlPointIndex;
        for (let i:number = this._currentControlPointIndex+1; i < this._controlPoints.length; i++) {
            const controlPoint:IControlPoint = this._controlPoints[i];
            if (lengthPassed>=controlPoint.from) result = i;
        }
        this._currentControlPointIndex = result;
        return this._controlPoints[result];
    }

    private lookupNextControlPoint():IControlPoint {
        const nextIndex:number = (this._currentControlPointIndex+1)%this._controlPoints.length;
        return this._controlPoints[nextIndex];
    }

    public nextPointByLengthPassed(lengthPassed:number):Optional<IPointAndAngle> {
        const point:Optional<IControlPoint> = this.getCurrentControlPoint(lengthPassed);
        if (point===undefined) return undefined;
        const lengthPassedRelative:number = lengthPassed - point.from;
        const passedFactor:number =
            point.length===0? 0: lengthPassedRelative/point.length;
        const x:number = point.pointFrom.x + (point.pointTo.x - point.pointFrom.x)*passedFactor;
        const y:number = point.pointFrom.y + (point.pointTo.y - point.pointFrom.y)*passedFactor;
        this.point.setXY(x,y);
        const nextControlPoint = this.lookupNextControlPoint();
        this.point.angle = MathEx.getAngle(nextControlPoint.pointFrom,this.point);
        return this.point;
    }

    public nextPointByLengthPassedRelative(lengthPassedRelative:number /*0...1**/):Optional<IPointAndAngle> {
        return this.nextPointByLengthPassed(lengthPassedRelative*this._totalLength);
    }

    public reset():void{
        this._currentControlPointIndex = 0;
    }

    public getTotalLength():number {
        return this._totalLength;
    }
}

export class MoveByPathAnimation extends AbstractMoveAnimation {

    public velocity: number = 10;
    public durationSec:Optional<number>;

    private _oldDurationSec:Optional<number>;
    private _controlPointResolver:ControlPointByLengthPassedResolver;



    constructor(game:Game,polyLine:PolyLine) {
        super(game);
        this._controlPointResolver = new ControlPointByLengthPassedResolver(polyLine);
    }

    public override reset():void{
        super.reset();
        this._controlPointResolver.reset();
    }


    protected override onUpdate():void{
        if (this.durationSec!==undefined && this.durationSec!==this._oldDurationSec) {
            this._oldDurationSec = this.durationSec;
            this.velocity = this._controlPointResolver.getTotalLength() / this.durationSec;
        }
        const lengthPassed:number = this.velocity * this.passedTime / 1000;
        const point:Optional<IPoint2d> = this._controlPointResolver.nextPointByLengthPassed(lengthPassed);
        if (point===undefined) return;
        this.progressPoint.set(point);
        if (lengthPassed>=this._controlPointResolver.getTotalLength()) {
            this.reset();
            this.numOfLoopPassed++;
        }
        super.onUpdate();
    }

}

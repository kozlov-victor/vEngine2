import {IAnimation} from "@engine/animation/iAnimation";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {EaseFn} from "@engine/misc/easing/type";
import {Game} from "@engine/core/game";
import {IPoint2d, Point2d} from "@engine/geometry/point2d";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {Tween} from "@engine/animation/tween";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ControlPointByLengthPassedResolver} from "@engine/animation/propertyAnimation/moveByPathAnimation";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Line} from "@engine/renderable/impl/geometry/line";
import {MathEx} from "@engine/misc/mathEx";
import {calcPolylineLength} from "@engine/renderable/impl/geometry/_internal/calcPolylineLength";
import {Optional} from "@engine/core/declarations";

interface IPointOnCurve {
    lengthPassed:number;
    point:Point2d;
}

// const pset = (p:IPoint2d,color:string):void=> {
//     const div = document.createElement('div');
//     div.style.position = 'absolute';
//     div.style.left = `${p.x}px`;
//     div.style.top = `${p.y}px`;
//     div.style.zIndex = '1000';
//     div.style.width = '2px';
//     div.style.height = '2px';
//     div.style.backgroundColor = color;
//     document.body.appendChild(div);
// };

export class ShapeAnimation implements IAnimation {

    constructor(private game:Game,private from:Polygon,private to:Polygon,private container:RenderableModel,private time:number = 1000,private ease:EaseFn = EasingLinear) {
        const {from:pFrom,to:pTo} = ShapeAnimation.normalizePoints(game,from,to);
        const numberOfFrames:number = ~~(time/60);
        const target:{frame:number} = {frame:0};

        let currentShape:Polygon = undefined!;
        const interpolated:Point2d[] = [];
        for (const p of pFrom) interpolated.push(new Point2d());

        this.t = new Tween({
            from: {frame:0},
            to:{frame:numberOfFrames},
            target,
            time,
            ease,
            progress:(t)=>{
                for (let i:number = 0;i<pFrom.length;i++) {
                    const currPFrom:Point2d = pFrom[i];
                    const currPTo:Point2d = pTo[i];
                    const interpolatedX:number = EasingLinear(t.frame,currPFrom.x,currPTo.x - currPFrom.x,numberOfFrames);
                    const interpolatedY:number = EasingLinear(t.frame,currPFrom.y,currPTo.y - currPFrom.y,numberOfFrames);
                    interpolated[i].setXY(interpolatedX,interpolatedY);
                }
                if (currentShape!==undefined) currentShape.removeSelf();
                currentShape = Polygon.fromPoints(this.game,interpolated);
                this.container.appendChild(currentShape);
                if (this.progress) this.progress(currentShape);
            }
        });
    }

    private t:Tween<{frame:number}>;
    private progress:(p:Polygon)=>void;

    private static normalizePoints(game:Game,from:Polygon, to:Polygon):{from:Point2d[],to:Point2d[]} {
        const pointsOfFromPoly:IPointOnCurve[] = [];
        const pointsOfToPoly:IPointOnCurve[] = [];

        const polylineFrom:PolyLine = PolyLine.fromVertices(game,from.getEdgeVertices());
        const polyLineTo:PolyLine = PolyLine.fromVertices(game,to.getEdgeVertices());

        const polylineFromLength:number = calcPolylineLength(polylineFrom);
        const polylineToLength:number = calcPolylineLength(polyLineTo);

        let lengthPassed:number = 0;

        const controlPointFromResolver = new ControlPointByLengthPassedResolver(polylineFrom);
        const helperPoint:Point2d = new Point2d();
        polylineFrom.getSegments().forEach((line:Readonly<Line>)=>{
            const relativePassed:number = lengthPassed/polylineFromLength;
            const p:Optional<IPoint2d> = controlPointFromResolver.nextPointByLengthPassedRelative(relativePassed);
            if (p===undefined) return;
            lengthPassed+=MathEx.getDistance(helperPoint,line.pointTo);
            pointsOfFromPoly.push({lengthPassed:relativePassed,point:new Point2d(p.x,p.y)});
        });
        controlPointFromResolver.reset();
        lengthPassed = 0;
        polyLineTo.getSegments().forEach((line:Readonly<Line>)=>{
            const relativePassed:number = lengthPassed/polylineToLength;
            const p:Optional<IPoint2d> = controlPointFromResolver.nextPointByLengthPassedRelative(relativePassed);
            if (p===undefined) return;
            lengthPassed+=MathEx.getDistance(helperPoint,line.pointTo);
            pointsOfFromPoly.push({lengthPassed:relativePassed,point:new Point2d(p.x,p.y)});
        });

        lengthPassed = 0;
        const controlPointToResolver = new ControlPointByLengthPassedResolver(polyLineTo);
        polyLineTo.getSegments().forEach((line:Readonly<Line>)=>{
            const relativePassed:number = lengthPassed/polylineToLength;
            const p:Optional<IPoint2d> = controlPointToResolver.nextPointByLengthPassedRelative(relativePassed);
            if (p===undefined) return;
            lengthPassed+=MathEx.getDistance(helperPoint,line.pointTo);
            pointsOfToPoly.push({lengthPassed:relativePassed,point:new Point2d(p.x,p.y)});
        });
        lengthPassed = 0;
        controlPointToResolver.reset();
        polylineFrom.getSegments().forEach((line:Readonly<Line>)=>{
            const relativePassed:number = lengthPassed/polylineFromLength;
            const p:Optional<IPoint2d> = controlPointToResolver.nextPointByLengthPassedRelative(relativePassed);
            if (p===undefined) return;
            lengthPassed+=MathEx.getDistance(helperPoint,line.pointTo);
            pointsOfToPoly.push({lengthPassed:relativePassed,point:new Point2d(p.x,p.y)});
        });

        pointsOfFromPoly.sort((_a, _b)=>_a.lengthPassed>_b.lengthPassed?1:-1);
        pointsOfToPoly.sort((_a, _b)=>_a.lengthPassed>_b.lengthPassed?1:-1);
        const resultPointsFrom:Point2d[] = pointsOfFromPoly.map(it=>it.point);
        const resultPointsTo:Point2d[] = pointsOfToPoly.map(it=>it.point);
        return {
            from:resultPointsFrom,
            to:resultPointsTo,
        };
    }

    public onProgress(fn:(polygon:Polygon)=>void):void{
        this.progress = fn;
    }

    play(): void {
        this.game.getCurrentScene().addTween(this.t);
    }

    stop(): void {
        this.t.stop();
    }

    update(): void {
    }


}

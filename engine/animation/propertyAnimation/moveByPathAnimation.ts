import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Line} from "@engine/renderable/impl/geometry/line";
import {MathEx} from "@engine/misc/mathEx";
import {Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";

interface IControlPoint {
    length:number;
    lengthPassed:number;
    pos:Point2d;
}

export class MoveByPathAnimation {

    public infinity:number = 0;

    private controlPoints:IControlPoint[] = [];
    private _started:boolean = false;
    private _startedTime:number = 0;

    constructor(private game:Game,polyLine:PolyLine) {
        const lengthPassed:number = 0;
        const zeroPoint:Point2d = new Point2d();
        polyLine.children.forEach((c:Line)=>{
            const length:number = MathEx.getDistance(zeroPoint,c.pointTo);
            this.controlPoints.push({
                length,
                lengthPassed,
                pos:c.pos,
            });
        });
    }

    public start(opts:{time:number}){
        this._started = true;
    }

    public update(){
        if (!this._started) return;
        const time:number = this.game.getTime();
        if (this._startedTime===0) this._startedTime = time;
        const delta:number = time - this._startedTime;
    }

}
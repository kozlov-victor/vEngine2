import {AbstractPropertyAnimation} from "@engine/animation/propertyAnimation/abstract/abstractPropertyAnimation";
import {Point2d} from "@engine/geometry/point2d";
import {MathEx} from "@engine/misc/math/mathEx";

export abstract class AbstractMoveAnimation extends AbstractPropertyAnimation {

    public rotate = false;
    declare public onProgress:(fn:(point:Point2d,angle:number)=>void)=>void;
    public repeatCount:number = Infinity;

    protected numOfLoopPassed = 0;
    protected angle = 0;
    protected progressPoint = new Point2d();

    private _oldPoint:Point2d;
    private _terminated = false;

    protected onUpdate(): void {
        if (this._terminated) return;
        if (this.numOfLoopPassed>this.repeatCount) {
            this._terminated = true;
            this.reset();
            return;
        }
        if (this.rotate) {
            if (this._oldPoint===undefined) {
                this._oldPoint = new Point2d(this.progressPoint.x,this.progressPoint.y);
            }
            this.angle = MathEx.getAngle(this.progressPoint,this._oldPoint);
            this._oldPoint.setXY(this.progressPoint.x,this.progressPoint.y);
            if (this._target!==undefined) this._target.angle = this.angle;
        }
        if (this._target!==undefined) this._target.pos.setFrom(this.progressPoint);
        if (this.progress!==undefined) this.progress(this.progressPoint,this.angle);
    }
}

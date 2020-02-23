import {AbstractPropertyAnimation} from "@engine/animation/propertyAnimation/abstract/abstractPropertyAnimation";
import {Point2d} from "@engine/geometry/point2d";
import {MathEx} from "@engine/misc/mathEx";

export abstract class AbstractMoveAnimation extends AbstractPropertyAnimation {

    public rotate:boolean = false;
    public onProgress:(fn:(point:Point2d,angle:number)=>void)=>void;

    protected angle:number = 0;
    protected progressPoint:Point2d = new Point2d();

    private oldPoint:Point2d;

    protected onUpdate(): void {
        if (this.rotate) {
            if (this.oldPoint===undefined) {
                this.oldPoint = new Point2d(this.progressPoint.x,this.progressPoint.y);
            }
            this.angle = MathEx.getAngle(this.progressPoint,this.oldPoint);
            this.oldPoint.setXY(this.progressPoint.x,this.progressPoint.y);
            if (this.target!==undefined) this.target.angle = this.angle;
        }
        if (this.target!==undefined) this.target.pos.set(this.progressPoint);
        if (this.progress!==undefined) this.progress(this.progressPoint,this.angle);
    }
}

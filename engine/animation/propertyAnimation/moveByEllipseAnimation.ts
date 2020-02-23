import {Point2d} from "@engine/geometry/point2d";
import {AbstractMoveAnimation} from "@engine/animation/propertyAnimation/abstract/abstractMoveAnimation";

const PI_2:number = Math.PI *2;
export const FACTOR: number = PI_2 * 2 / 6000;

export class MoveByEllipseAnimation extends AbstractMoveAnimation {

    public radiusX:number = 50;
    public radiusY:number = 50;
    public angularVelocity:number = 1; // rad in sec
    public readonly center:Point2d = new Point2d(this.game.size.width/2,this.game.size.height/2);

    protected onUpdate(): void {
        const arg:number = FACTOR * this.angularVelocity * this.passedTime;
        if (this.repeatCount!==Infinity) this.numOfLoopPassed = ~~(arg/PI_2);
        const x:number = this.center.x + this.radiusX * Math.cos(arg);
        const y:number = this.center.y + this.radiusY * Math.sin(arg);
        this.progressPoint.setXY(x,y);
        super.onUpdate();
    }

}

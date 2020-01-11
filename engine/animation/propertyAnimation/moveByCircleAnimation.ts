import {MoveByEllipseAnimation} from "@engine/animation/propertyAnimation/moveByEllipseAnimation";

export class MoveByCircleAnimation extends MoveByEllipseAnimation {

    set radius(val:number) {
        (this as MoveByEllipseAnimation).radiusX = (this as MoveByEllipseAnimation).radiusY = val;
    }

    get radius():number{
        return (this as MoveByEllipseAnimation).radiusX;
    }

    public radiusX:never;
    public radiusY:never;

}
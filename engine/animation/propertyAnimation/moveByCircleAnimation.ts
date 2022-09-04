import {MoveByEllipseAnimation} from "@engine/animation/propertyAnimation/moveByEllipseAnimation";

export class MoveByCircleAnimation extends MoveByEllipseAnimation {

    public set radius(val:number) {
        (this as MoveByEllipseAnimation).radiusX = (this as MoveByEllipseAnimation).radiusY = val;
    }

    public get radius():number {
        return (this as MoveByEllipseAnimation).radiusX;
    }

    declare public radiusX:never;
    declare public radiusY:never;

}

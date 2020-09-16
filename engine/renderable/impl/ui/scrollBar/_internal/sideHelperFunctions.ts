import {Point2d} from "@engine/geometry/point2d";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {Size} from "@engine/geometry/size";

export enum Direction {
    HORIZONTAL,
    VERTICAL,
}

export const assignPos = (pos: Point2d, value: number,dir:Direction):void=> {
    if (dir===Direction.VERTICAL) pos.y = value;
    else pos.x = value;
};

export const getPos =(pos: Point2d,dir:Direction):number=> {
    if (dir===Direction.VERTICAL) return  pos.y;
    else return pos.x;
}

export const assignSize = (size: Size, value: number,dir:Direction):void=> {
    if (dir===Direction.VERTICAL) size.height = value;
    else size.width = value;
};

export const getMouse = (point: IObjectMouseEvent,dir:Direction):number=> {
    if (dir===Direction.VERTICAL) return point.sceneY;
    else return point.sceneX;
};

export const getSize =(size: Size,dir:Direction):number=> {
    if (dir===Direction.VERTICAL) return  size.height;
    else return size.width;
}

export const getOppositeDirection = (dir:Direction):Direction=> {
    if (dir===Direction.VERTICAL) return  Direction.HORIZONTAL;
    else return Direction.VERTICAL;
}

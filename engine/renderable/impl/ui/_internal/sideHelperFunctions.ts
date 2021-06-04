import {Point2d} from "@engine/geometry/point2d";
import {ISize, Size} from "@engine/geometry/size";

export enum Direction {
    HORIZONTAL,
    VERTICAL,
}

export const assignPos = (pos: Point2d, value: number,dir:Direction):void=> {
    if (dir===Direction.VERTICAL) pos.y = value;
    else pos.x = value;
};

export const getPos =(pos: IPoint,dir:Direction):number=> {
    if (dir===Direction.VERTICAL) return  pos.y;
    else return pos.x;
};

export const assignSize = (size: Size, value: number,dir:Direction):void=> {
    if (dir===Direction.VERTICAL) size.height = value;
    else size.width = value;
};

export const getMouseScreenCoordinates = (point: {sceneX:number, sceneY:number}, dir:Direction):number=> {
    if (dir===Direction.VERTICAL) return point.sceneY;
    else return point.sceneX;
};

export const getMouseObjectCoordinates = (point: {objectX:number, objectY:number}, dir:Direction):number=> {
    if (dir===Direction.VERTICAL) return point.objectY;
    else return point.objectX;
};

export const getSize =(size: ISize,dir:Direction):number=> {
    if (dir===Direction.VERTICAL) return  size.height;
    else return size.width;
};

export const getOppositeDirection = (dir:Direction):Direction=> {
    if (dir===Direction.VERTICAL) return  Direction.HORIZONTAL;
    else return Direction.VERTICAL;
};

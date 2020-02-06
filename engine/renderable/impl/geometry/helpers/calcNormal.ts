import {IPoint3d} from "@engine/geometry/point3d";

export const calcNormal = (p1:IPoint3d,p2:IPoint3d,p3:IPoint3d):IPoint3d=> {
    const a:IPoint3d = {
        x:p2.x-p1.x,
        y:p2.y-p1.y,
        z:p2.z-p1.z,
    };
    const b:IPoint3d = {
        x:p3.x-p1.x,
        y:p3.y-p1.y,
        z:p3.z-p1.z,
    };
    const n:IPoint3d = {
        x:a.y*b.z - a.z*b.y,
        y:a.z*b.x - a.x*b.z,
        z:a.x*b.y - a.y*b.x
    };
    const l:number = Math.sqrt(n.x*n.x+n.y*n.y+n.z*n.z);
    return {
        x:n.x/l,
        y:n.y/l,
        z:n.z/l
    };
};

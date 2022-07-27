import {IPoint3d, Point3d} from "@engine/geometry/point3d";

export namespace vec3 {

    export const normalize = (v:IPoint3d,out?:IPoint3d):IPoint3d=> {
        out = out ?? new Point3d(v.x,v.y,v.z);
        const l = length(v);
        // make sure we don't divide by 0.
        if (l > 0.00001) {
            out.x = out.x / l;
            out.y = out.y / l;
            out.z = out.z / l;
        }
        return out;
    }

    export const subtract = (a:IPoint3d, b:IPoint3d, out?:IPoint3d):IPoint3d=>{
        out = out ?? new Point3d();
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }

    export const cross = (a:IPoint3d, b:IPoint3d, out?:IPoint3d):IPoint3d=>{
        out = out ?? new  Point3d();
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;
        return out;
    }

    export const dot = (a:IPoint3d, b:IPoint3d):number=>{
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    }

    export const distanceSq = (a:IPoint3d, b:IPoint3d):number=>{
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }

    export const distance = (a:IPoint3d, b:IPoint3d):number=>{
        return Math.sqrt(distanceSq(a,b));
    }

    export const lengthSq = (v:IPoint3d):number=>{
        return v.x * v.x + v.y * v.y + v.z * v.z;
    }

    export const length = (v:IPoint3d):number=>{
        return Math.sqrt(lengthSq(v));
    }

}

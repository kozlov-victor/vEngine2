import {ReleaseableEntity} from "@engine/misc/releaseableEntity";
import {ObjectPool} from "@engine/misc/objectPool";

export namespace vec4 {

    type n = number;

    export type VEC4 = [n,n,n,n];

    export class Vec4Holder extends ReleaseableEntity {

        public static fromPool():Vec4Holder {
            return Vec4Holder.pool.getFreeObject()!;
        }
        private static pool = new ObjectPool<Vec4Holder>(Vec4Holder,32);

        public readonly vec4:Readonly<VEC4> = (new Float32Array(4) as unknown) as VEC4; // exports only readonly arr

        public set(x:n,y:n,z:n,w:n) {
            const v:VEC4 = this.vec4 as VEC4;
            v[0] = x;
            v[1] = y;
            v[2] = z;
            v[3] = w;
        }


        get x():n{
            return (this.vec4 as VEC4)[0];
        }

        get y():n{
            return (this.vec4 as VEC4)[1];
        }

        get z():n{
            return (this.vec4 as VEC4)[2];
        }

        get w():n{
            return (this.vec4 as VEC4)[3];
        }


    }
}


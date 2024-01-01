import {ObjectPool} from "@engine/misc/objectPool";

export namespace Vec4 {

    type n = number;

    export type VEC4 = [n,n,n,n];

    export class Vec4Holder {

        public get x():n{
            return this.vec4[0];
        }

        public get y():n{
            return this.vec4[1];
        }

        public get z():n{
            return this.vec4[2];
        }

        public get w():n{
            return this.vec4[3];
        }

        public static pool = new ObjectPool<Vec4Holder>(Vec4Holder);

        public readonly vec4:Readonly<VEC4> = (new Float32Array(4) as unknown) as VEC4; // exports only readonly arr

        public set(x:n,y:n,z:n,w:n):void{
            const v:VEC4 = this.vec4 as VEC4;
            v[0] = x;
            v[1] = y;
            v[2] = z;
            v[3] = w;
        }


    }
}


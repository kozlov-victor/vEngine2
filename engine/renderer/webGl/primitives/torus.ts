import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Int} from "@engine/core/declarations";
import {DRAW_METHOD} from "@engine/renderer/webGl/base/buffer/bufferInfo";

export class Torus extends AbstractPrimitive {

    /*
        r = torus ring radius
        c = torus tube radius
        rSeg, cSeg = number of segments/detail
    */
    constructor(r:number = 10, c:number = 15, rSeg:Int = 16 as Int, cSeg:Int = 8 as Int){
        super();

        this.vertexArr = [];
        this.normalArr = [];
        this.texCoordArr = [];
        this.indexArr = [];
        this.drawMethod = DRAW_METHOD.TRIANGLE_STRIP;

        // according to https://gist.github.com/gyng/8939105
        const PI:number = Math.PI;
        const TAU:number = 2 * PI;
        let cnt:number = 0;
        for (let i:number = 0; i < rSeg; i++) {
            for (let j: number = 0; j <= cSeg; j++) {
                for (let k: number = 0; k <= 1; k++) {
                    const s: number = (i + k) % rSeg + 0.5;
                    const t: number = j % (cSeg + 1);

                    const x: number = (c + r * Math.cos(s * TAU / rSeg)) * Math.cos(t * TAU / cSeg);
                    const y: number = (c + r * Math.cos(s * TAU / rSeg)) * Math.sin(t * TAU / cSeg);
                    const z: number = r * Math.sin(s * TAU / rSeg);

                    const u: number = (i + k) / rSeg;
                    const v: number = t / cSeg;

                    this.texCoordArr.push(u, v);
                    this.normalArr.push(2 * x, 2 * y, 2 * z);
                    this.vertexArr.push(2 * x, 2 * y, 2 * z);
                    this.indexArr.push(cnt++);
                }
            }
        }
    }


}


// by https://github.com/mrdoob/three.js/blob/master/src/extras/core/Font.js

import {DebugError} from "@engine/debug/debugError";

export class FaceTypeToSvg {

    public convert(s:string,scale:number,offsetX:number,offsetY:number):string {
        return this.process(s,scale,offsetX,offsetY);
    }

    private toNumber(s:string):number {
        const n:number = Number(s);
        if (Number.isNaN(n)) throw new DebugError(`wrong numeric token: ${s}`);
        return n;
    }

    private process(s:string,scale:number,offsetX:number,offsetY:number) {
        const outline:string[] = s.split(' ').filter(it=>it.trim().length>0);
        let res:string = '';
        for (let i:number = 0,l = outline.length;i < l;) {
            const action: string = outline[i++];
            switch (action) {
                case 'm': {
                    // moveTo
                    const x: number = this.toNumber(outline[i++]) * scale + offsetX;
                    const y: number = -this.toNumber(outline[i++]) * scale + offsetY;
                    res += `${res.length>0?'Z':''} M ${x} ${y} `;
                    break;
                }
                case 'l': {
                    // lineTo
                    const x: number = this.toNumber(outline[i++]) * scale + offsetX;
                    const y: number = -this.toNumber(outline[i++]) * scale + offsetY;
                    res += `L ${x} ${y} `;
                    break;
                }

                case 'q': {
                    // quadraticCurveTo
                    const cpx:number  = this.toNumber(outline[i++]) * scale + offsetX;
                    const cpy:number  = -this.toNumber(outline[i++]) * scale + offsetY;
                    const cpx1:number = this.toNumber(outline[i++]) * scale + offsetX;
                    const cpy1:number = -this.toNumber(outline[i++]) * scale + offsetY;
                    res += `Q ${cpx1} ${cpy1} ${cpx} ${cpy} `;
                    break;
                }

                default:
                    //throw new DebugError(`unknown command: ${action}`);
            }
        }
        return `${res} Z`;
    }

}

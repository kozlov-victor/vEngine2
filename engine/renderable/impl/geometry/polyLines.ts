import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Game} from "@engine/core/game";

export class PolyLines {

    public static createEllipse(game:Game,radiusX:number,radiusY:number):PolyLine {

        const w:number = radiusX*2;
        const h:number = radiusY*2;
        const x:number = 0;
        const y:number = 0;
        const kappa:number = 0.5522848;
        const ox:number = (w / 2) * kappa; // control point offset horizontal
        const oy:number = (h / 2) * kappa; // control point offset vertical
        const xe:number = x + w; // x-end
        const ye:number = y + h; // y-end
        const xm:number = x + (w / 2); // x-middle
        const ym:number = y + (h / 2); // y-middle

        const d:string = `
            M ${x} ${ym}
            C ${x} ${ym - oy} ${xm - ox} ${y} ${xm} ${y}
            C ${xm + ox} ${y} ${xe} ${ym - oy} ${xe} ${ym}
            C ${xe} ${ym + oy} ${xm + ox} ${ye} ${xm} ${ye}
            C ${xm - ox} ${ye} ${x} ${ym + oy} ${x} ${ym}
            Z
        `;
        return PolyLine.fromSvgPath(game,d);
    }

    public static createRoundedRect(game:Game, width:number,height:number,borderRadius:number):PolyLine {
        const strokeWidth:number = 1;
        const s:number = strokeWidth / 2;
        const over:number = 2 * borderRadius + strokeWidth;
        const w:number = width - over;
        const h:number = height - over;
        const d:string = `
            M${borderRadius + s},${s}
            h${w}
            a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},${borderRadius}
            v${h}
            a${borderRadius},${borderRadius} 0 0 1 -${borderRadius},${borderRadius}
            h-${w}
            a${borderRadius},${borderRadius} 0 0 1 -${borderRadius},-${borderRadius}
            v-${h}
            a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},-${borderRadius}
            Z
        `;

        return PolyLine.fromSvgPath(game,d);
    }

}

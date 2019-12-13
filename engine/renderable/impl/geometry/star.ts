import {Game} from "@engine/core/game";
import {Polygon, StaticPolygon} from "@engine/renderable/impl/geometry/polygon";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";

// according to https://github.com/pixijs/pixi.js/blob/873b65041bd3a5d173b0e0e10fa93be68bc033d9/packages/graphics/src/utils/Star.js

export class Star extends StaticPolygon {

    constructor(game:Game,points:number, radius:number, innerRadius = radius / 2, rotation:number = 0){
        super(game);
        const startAngle:number = (-1 * Math.PI / 2) + rotation;
        const len:number = points * 2;
        const delta:number = Math.PI * 2 / len;
        const vertices:number[] = [];

        for (let i:number = 0; i < len; i++) {
            const r:number = i % 2 ? innerRadius : radius;
            const angle:number = (i * delta) + startAngle;

            vertices.push(
                (r * Math.cos(angle)),
                (r * Math.sin(angle))
            );
        }

        vertices.push(vertices[0],vertices[1]); // close path

        const p:PolyLine = new PolyLine(game);
        p.fromPoints(vertices);
        Polygon.prototype.fromPolyline.call(this,p);
    }


}
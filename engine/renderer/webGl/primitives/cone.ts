
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";

// https://webglsamples.org/tdl/primitives.js

export class Cone extends AbstractPrimitive {

    constructor(bottomRadius:number,
                topRadius:number,
                height:number,
                radialSubdivisions:number = 20,
                verticalSubdivisions:number = 20,
                topCap:boolean = true,
                bottomCap:boolean = true){

        super();

        if (radialSubdivisions < 3) {
            throw Error('radialSubdivisions must be 3 or greater');
        }

        if (verticalSubdivisions < 1) {
            throw Error('verticalSubdivisions must be 1 or greater');
        }

        const extra:number = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);

        let numVertices = (radialSubdivisions + 1) * (verticalSubdivisions + 1 + extra);
        const positions:number[] = [];
        const normals:number[] = [];
        const texCoords:number[] = [];
        let indices:number[] = [];

        const vertsAroundEdge:number = radialSubdivisions + 1;

        // The slant of the cone is constant across its surface
        const slant:number = Math.atan2(bottomRadius - topRadius, height);
        const cosSlant:number = Math.cos(slant);
        const sinSlant:number = Math.sin(slant);

        const start:number = topCap ? -2 : 0;
        const end:number = verticalSubdivisions + (bottomCap ? 2 : 0);

        for (let yy:number = start; yy <= end; ++yy) {
            let v:number = yy / verticalSubdivisions;
            let y:number = height * v;
            let ringRadius:number;
            if (yy < 0) {
                y = 0;
                v = 1;
                ringRadius = bottomRadius;
            } else if (yy > verticalSubdivisions) {
                y = height;
                v = 1;
                ringRadius = topRadius;
            } else {
                ringRadius = bottomRadius +
                    (topRadius - bottomRadius) * (yy / verticalSubdivisions);
            }
            if (yy == -2 || yy == verticalSubdivisions + 2) {
                ringRadius = 0;
                v = 0;
            }
            y -= height / 2;
            for (let ii:number = 0; ii < vertsAroundEdge; ++ii) {
                const sin:number = Math.sin(ii * Math.PI * 2 / radialSubdivisions);
                const cos:number = Math.cos(ii * Math.PI * 2 / radialSubdivisions);
                positions.push(sin * ringRadius, y, cos * ringRadius);
                normals.push(
                    (yy < 0 || yy > verticalSubdivisions) ? 0 : (sin * cosSlant),
                    (yy < 0) ? -1 : (yy > verticalSubdivisions ? 1 : sinSlant),
                    (yy < 0 || yy > verticalSubdivisions) ? 0 : (cos * cosSlant));
                texCoords.push((ii / radialSubdivisions), 1 - v);
            }
        }

        for (let yy:number = 0; yy < verticalSubdivisions + extra; ++yy) {
            for (let ii:number = 0; ii < radialSubdivisions; ++ii) {
                indices.push(vertsAroundEdge * (yy + 0) + 0 + ii,
                    vertsAroundEdge * (yy + 0) + 1 + ii,
                    vertsAroundEdge * (yy + 1) + 1 + ii);
                indices.push(vertsAroundEdge * (yy + 0) + 0 + ii,
                    vertsAroundEdge * (yy + 1) + 1 + ii,
                    vertsAroundEdge * (yy + 1) + 0 + ii);
            }
        }

        this.vertexArr = positions;
        this.normalArr = normals;
        this.texCoordArr = texCoords;
        this.indexArr = indices;
    }


}



// https://github.com/mrdoob/three.js/blob/master/src/geometries/TorusKnotGeometry.js

import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Point3d} from "@engine/geometry/point3d";

const calculatePositionOnCurve = ( u: number, p: number, q: number, radius: number, position: Point3d ):void=> {

    const cu = Math.cos( u );
    const su = Math.sin( u );
    const quOverP = q / p * u;
    const cs = Math.cos( quOverP );

    position.x = radius * ( 2 + cs ) * 0.5 * cu;
    position.y = radius * ( 2 + cs ) * su * 0.5;
    position.z = radius * Math.sin( quOverP ) * 0.5;

}

const subVectors = (result:Point3d,a:Point3d, b:Point3d):void=> {
    result.x = a.x - b.x;
    result.y = a.y - b.y;
    result.z = a.z - b.z;
}

const addVectors = (result:Point3d,a:Point3d, b:Point3d):void=> {
    result.x = a.x + b.x;
    result.y = a.y + b.y;
    result.z = a.z + b.z;
}

const crossVectors = (result:Point3d,a:Point3d, b:Point3d):void=> {
    const x = a.y * b.z - a.z * b.y;
    const y = a.z * b.x - a.x * b.z;
    const z = a.x * b.y - a.y * b.x;
    result.setXYZ(x,y,z);
}

const normalize = (a:Point3d):void=> {
    const length = Math.sqrt( a.x**2 + a.y**2 + a.z**2 );
    a.setXYZ(
       a.x/length,
       a.y/length,
       a.z/length
    );
}

export class Knot extends AbstractPrimitive {

    constructor(
        radius = 200,
        tube = 50,
        tubularSegments = 64,
        radialSegments = 8,
        p = 2,
        q = 3) {
        super();

        tubularSegments = Math.floor( tubularSegments );
        radialSegments = Math.floor( radialSegments );

        // buffers

        const indices:number[] = [];
        const vertices:number[] = [];
        const normals:number[] = [];
        const uvs:number[] = [];

        // helper variables

        const vertex = new Point3d();
        const normal = new Point3d();

        const P1 = new Point3d();
        const P2 = new Point3d();

        const B = new Point3d();
        const T = new Point3d();
        const N = new Point3d();

        // generate vertices, normals and uvs

        for ( let i = 0; i <= tubularSegments; ++ i ) {

            // the radian "u" is used to calculate the position on the torus curve of the current tubular segment

            const u = i / tubularSegments * p * Math.PI * 2;

            // now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
            // these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions

            calculatePositionOnCurve( u, p, q, radius, P1 );
            calculatePositionOnCurve( u + 0.01, p, q, radius, P2 );

            // calculate orthonormal basis

            subVectors( T, P2, P1);
            addVectors( N, P2, P1);
            crossVectors(B, T, N);
            crossVectors(N, B, T);

            // normalize B, N. T can be ignored, we don't use it

            normalize(B);
            normalize(N);

            for ( let j = 0; j <= radialSegments; ++ j ) {

                // now calculate the vertices. they are nothing more than an extrusion of the torus curve.
                // because we extrude a shape in the xy-plane, there is no need to calculate a z-value.

                const v = j / radialSegments * Math.PI * 2;
                const cx = - tube * Math.cos( v );
                const cy = tube * Math.sin( v );

                // now calculate the final vertex position.
                // first we orient the extrusion with our basis vectors, then we add it to the current position on the curve

                vertex.x = P1.x + ( cx * N.x + cy * B.x );
                vertex.y = P1.y + ( cx * N.y + cy * B.y );
                vertex.z = P1.z + ( cx * N.z + cy * B.z );

                vertices.push( vertex.x, vertex.y, vertex.z );

                // normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)

                subVectors(normal, vertex, P1 );
                normalize(normal);

                normals.push( normal.x, normal.y, normal.z );

                // uv

                uvs.push( i / tubularSegments );
                uvs.push( j / radialSegments );

                this.indexArr = indices;
                this.vertexArr = vertices;
                this.texCoordArr = uvs;
                this.normalArr = normals;

            }

        }

        // generate indices

        for ( let j = 1; j <= tubularSegments; j ++ ) {

            for ( let i = 1; i <= radialSegments; i ++ ) {

                // indices

                const a = ( radialSegments + 1 ) * ( j - 1 ) + ( i - 1 );
                const b = ( radialSegments + 1 ) * j + ( i - 1 );
                const c = ( radialSegments + 1 ) * j + i;
                const d = ( radialSegments + 1 ) * ( j - 1 ) + i;

                // faces

                indices.push( a, b, d );
                indices.push( b, c, d );

            }

        }

    }

}

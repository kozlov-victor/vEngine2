import {Game} from "@engine/core/game";
import {Point3d} from "@engine/geometry/point3d";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ICubeMapTexture} from "@engine/renderer/common/texture";
import {Optional} from "@engine/core/declarations";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Color} from "@engine/renderer/common/color";

// https://github.com/mrdoob/three.js/blob/dev/examples/js/loaders/STLLoader.js

export class StlPrimitive extends AbstractPrimitive {
    constructor(){
        super();
        this.vertexArr = [];
        this.normalArr = [];
    }
}

export class StlParser {

    private static parseBinary(data:ArrayBuffer):StlPrimitive {

        const reader = new DataView( data );
        const faces = reader.getUint32( 80, true );
        let r: Optional<number>,
            g: Optional<number>,
            b: Optional<number>,
            hasColors:boolean = false;
        const colors:number[] = new Array(faces * 3 * 3).fill(0);
        let defaultR: Optional<number>, defaultG: Optional<number>, defaultB: Optional<number>, alpha: Optional<number>; // process STL header
        // check for default color in header ("COLOR=rgba" sequence).

        for ( let index = 0; index < 80 - 10; index ++ ) {

            if ( reader.getUint32( index, false ) == 0x434F4C4F
                /*COLO*/
                && reader.getUint8( index + 4 ) == 0x52
                /*'R'*/
                && reader.getUint8( index + 5 ) == 0x3D
                /*'='*/
            ) {

                hasColors = true;
                defaultR = reader.getUint8( index + 6 ) / 255;
                defaultG = reader.getUint8( index + 7 ) / 255;
                defaultB = reader.getUint8( index + 8 ) / 255;
                alpha = reader.getUint8( index + 9 ) / 255;

            }

        }

        const dataOffset = 84;
        const faceLength = 12 * 4 + 2;
        const vertices = new Array( faces * 3 * 3 ).fill(0);
        const normals = new Array( faces * 3 * 3 ).fill(0);

        for ( let face = 0; face < faces; face ++ ) {

            const start = dataOffset + face * faceLength;
            const normalX = reader.getFloat32( start, true );
            const normalY = reader.getFloat32( start + 4, true );
            const normalZ = reader.getFloat32( start + 8, true );

            if ( hasColors ) {

                const packedColor = reader.getUint16( start + 48, true );

                if ( ( packedColor & 0x8000 ) === 0 ) {

                    // facet has its own unique color
                    r = ( packedColor & 0x1F ) / 31;
                    g = ( packedColor >> 5 & 0x1F ) / 31;
                    b = ( packedColor >> 10 & 0x1F ) / 31;

                } else {

                    r = defaultR;
                    g = defaultG;
                    b = defaultB;

                }

            }

            for ( let i = 1; i <= 3; i ++ ) {

                const vertexstart = start + i * 12;
                const componentIdx = face * 3 * 3 + ( i - 1 ) * 3;
                vertices[ componentIdx ] = reader.getFloat32( vertexstart, true );
                vertices[ componentIdx + 1 ] = reader.getFloat32( vertexstart + 4, true );
                vertices[ componentIdx + 2 ] = reader.getFloat32( vertexstart + 8, true );
                normals[ componentIdx ] = normalX;
                normals[ componentIdx + 1 ] = normalY;
                normals[ componentIdx + 2 ] = normalZ;

                if ( hasColors ) {
                    colors[ componentIdx ] = r!;
                    colors[ componentIdx + 1 ] = g!;
                    colors[ componentIdx + 2 ] = b!;
                }

            }

        }

        const pr = new StlPrimitive();
        pr.vertexArr = vertices;
        pr.normalArr = normals;
        if (hasColors) {
            pr.texCoordArr = colors;
        }
        return pr;

    }

    private static parseAscii(meshData: string):StlPrimitive {
        const patternSolid = /solid([\s\S]*?)endsolid/g;
        const patternFace = /facet([\s\S]*?)endfacet/g;
        let faceCounter = 0;
        const patternFloat = /[\s]+([+-]?\d*(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source;
        const patternVertex = new RegExp( 'vertex' + patternFloat + patternFloat + patternFloat, 'g' );
        const patternNormal = new RegExp( 'normal' + patternFloat + patternFloat + patternFloat, 'g' );
        const vertices = [];
        const normals = [];
        const normal = new Point3d();
        let result;
        let startVertex = 0;
        let endVertex = 0;

        while ( ( result = patternSolid.exec( meshData ) ) !== null ) {

            startVertex = endVertex;
            const solid = result[ 0 ];

            while ( ( result = patternFace.exec( solid ) ) !== null ) {

                let vertexCountPerFace = 0;
                let normalCountPerFace = 0;
                const text = result[ 0 ];

                while ( ( result = patternNormal.exec( text ) ) !== null ) {

                    normal.x = parseFloat( result[ 1 ] );
                    normal.y = parseFloat( result[ 2 ] );
                    normal.z = parseFloat( result[ 3 ] );
                    normalCountPerFace ++;

                }

                while ( ( result = patternVertex.exec( text ) ) !== null ) {

                    vertices.push( parseFloat( result[ 1 ] ), parseFloat( result[ 2 ] ), parseFloat( result[ 3 ] ) );
                    normals.push( normal.x, normal.y, normal.z );
                    vertexCountPerFace ++;
                    endVertex ++;

                } // every face have to own ONE valid normal


                if ( normalCountPerFace !== 1 ) {

                    console.error( 'STLLoader: Something isn\'t right with the normal of face number ' + faceCounter );

                } // each face have to own THREE valid vertices


                if ( vertexCountPerFace !== 3 ) {

                    console.error( 'Something isn\'t right with the vertices of face number ' + faceCounter );

                }

                faceCounter ++;

            }

        }
        const pr = new StlPrimitive();
        pr.vertexArr = vertices;
        pr.normalArr = normals;
        return pr;
    }

    public parse(game:Game,params:{meshData:ArrayBuffer|string,diffuseColor?:IColor,cubeMapTexture?:ICubeMapTexture}):Model3d{
        const parsed =
            ((params.meshData as string).substr!==undefined)?
                StlParser.parseAscii(params.meshData as string):
                StlParser.parseBinary(params.meshData as ArrayBuffer);
        const model3d = new Model3d(game,parsed);
        model3d.material.diffuseColor.setFrom(params.diffuseColor ?? Color.WHITE.clone());
        if (params.cubeMapTexture)  {
            model3d.cubeMapTexture = params.cubeMapTexture;
            model3d.material.reflectivity = 0.1;
        }
        return model3d;
    }

}

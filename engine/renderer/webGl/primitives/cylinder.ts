import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";

export class Cylinder extends AbstractPrimitive{


    constructor()
    {
        super();
        this.createGeometry();
    }
    
    private createGeometry(){
        const vertices:number[] = this.vertexArr = [];
        const texCoords:number[] = this.texCoordArr = [];
        const normals:number[] = this.normalArr = [];

        const sides = 5;
        const radius = 40;
        const height:number = 50;

        const theta:number = 2. * Math.PI / sides;
        const c:number = Math.cos(theta),
            s:number = Math.sin(theta);
        // coordinates on top of the circle, on xz plane
        let x2:number = radius, z2:number = 0;
        // make the strip

        for(let i=0; i<=sides; i++) {
            // texture coord
            const tx:number = i/sides;
            // normal
            const nf:number = 1./Math.sqrt(x2*x2+z2*z2),
            xn = x2*nf, zn = z2*nf;
            normals.push(xn,0,zn);
            texCoords.push(tx,0);
            vertices.push(x2,0,z2);
            normals.push(xn,0,zn);
            texCoords.push(tx,1);
            vertices.push(x2,height,z2);
            // next position
            const x3:number = x2;
            x2 = c * x2 - s * z2;
            z2 = s * x3 + c * z2;
        }
        this.drawMethod = 5; // todo triangle_strip


    }
}
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
type Point3 = Record<'x'|'y'|'z',number>;
type Point2 = Record<'x'|'y',number>;
type FacePoint = Record<'v'|'uv'|'n',number>;
type Face = [FacePoint,FacePoint,FacePoint];

type obj = {v_arr:Point3[],vn_arr:Point3[],f_arr:Face[],vt_arr:Point2[]};

class ObjPrimitive extends AbstractPrimitive {
    constructor(){
        super();
        this.vertexArr = [];
        this.normalArr = [];
        this.texCoordArr = [];
        this.indexArr = [];
    }
}

export class ObjParser {

    public objToPrimitive(objInstance:obj):AbstractPrimitive{
        const pr:ObjPrimitive = new ObjPrimitive();
        let cnt:number = 0;
        objInstance.f_arr.forEach((f:Face,i:number)=>{

            const vert1:Point3 = objInstance.v_arr[f[0].v-1];
            const vert2:Point3 = objInstance.v_arr[f[1].v-1];
            const vert3:Point3 = objInstance.v_arr[f[2].v-1];

            let norm1:Point3 = objInstance.vn_arr[f[0].n-1];
            let norm2:Point3 = objInstance.vn_arr[f[1].n-1];
            let norm3:Point3 = objInstance.vn_arr[f[2].n-1];

            if (!norm1) {
                norm1 = this.calcNormal(vert1,vert2,vert3);
                norm2 = {...norm1};
                norm3 = {...norm1};
            }

            const tex1:Point2 = objInstance.vt_arr[f[0].uv-1];
            const tex2:Point2 = objInstance.vt_arr[f[1].uv-1];
            const tex3:Point2 = objInstance.vt_arr[f[2].uv-1];

            //Nx = UyVz - UzVy
            //Ny = UzVx - UxVz
            //Nz = UxVy - UyVx
            // const norm1:Point3 = {x:0,y:0,z:0};
            // norm1.x = vert1.y*vert2.z - vert1.z*vert2.y;
            // norm1.y = vert1.z*vert2.x - vert1.x*vert2.z;
            // norm1.z = vert1.x*vert2.y - vert1.y*vert2.x;
            //
            // pr.normalArr.push(
            //     norm1.x,norm1.y,norm1.z,
            //     norm1.x,norm1.y,norm1.z,
            //     norm1.x,norm1.y,norm1.z
            // );

            pr.vertexArr.push(
                vert1.x,vert1.y,vert1.z,
                vert2.x,vert2.y,vert2.z,
                vert3.x,vert3.y,vert3.z,
            );

            if (norm1) {
                pr.normalArr.push(
                    norm1.x,norm1.y,norm1.z,
                    norm2.x,norm2.y,norm2.z,
                    norm3.x,norm3.y,norm3.z,
                );
            }

            if (tex1) {
                pr.texCoordArr.push(
                    tex1.x,tex1.y,
                    tex2.x,tex2.y,
                    tex3.x,tex3.y,
                );
            }

            pr.indexArr.push(cnt++,cnt++,cnt++);

        });
        if (!pr.indexArr.length) pr.indexArr = undefined;
        if (!pr.texCoordArr.length) pr.texCoordArr = undefined;
        if (!pr.normalArr.length) pr.normalArr = undefined;
        if (!pr.vertexArr.length) pr.vertexArr = undefined;
        console.log(pr);
        return pr;
    }

    public parse(source:string):AbstractPrimitive{
        return this.objToPrimitive(this.readObj(source));
    }



    private readPoint3(s:string):Point3{
        const point3:Point3 = {x:undefined,y:undefined,z:undefined} as Point3;
        s.split(' ').filter((it:string)=>it.trim().length).map((it:string)=>parseFloat(it)).forEach((n:number,i:number)=>{
            if (i===0) point3.x = n;
            else if (i===1) point3.y = n;
            else if (i===2) point3.z = n;
        });
        if (isNaN(point3.x) || isNaN(point3.y) || isNaN(point3.z)) throw new Error(`unexpected line ${s}`);
        return point3;
    }

    private readPoint2(s:string):Point2{
        const point2:Point2 = {x:undefined,y:undefined} as Point2;
        s.split(' ').filter((it:string)=>it.trim().length).map((it:string)=>parseFloat(it)).forEach((n:number,i:number)=>{
            if (i===0) point2.x = n;
            else if (i===1) point2.y = n;
        });
        if (isNaN(point2.x) || isNaN(point2.y)) throw new Error(`unexpected line ${s}`);
        return point2;
    }

    private readFace(s:string):Face{
        const face:Face = [
            {v:undefined,uv:undefined,n:undefined},
            {v:undefined,uv:undefined,n:undefined},
            {v:undefined,uv:undefined,n:undefined},
        ] as Face;

        s.split(' ').filter((it:string)=>it.trim().length).forEach((triplet:string,i:number)=>{
            triplet.trim().split('/').forEach((item:string,j:number)=>{
                if (j===0) face[i].v = parseInt(item);
                else if (j===1) face[i].uv = parseInt(item);
                else if (j===2) face[i].n = parseInt(item);
            });
            if (isNaN(face[i].v)) throw new Error(`bad face value ${s}`);
        });
        return face;
    }

    private readObj(source:string):obj{

        const objInstalce:obj = {
            v_arr:[],
            f_arr:[],
            vn_arr:[],
            vt_arr:[],
        } as obj;

        source.split('\n').forEach((line:string)=>{
            line = line.trim();
            const command:string = (line.substr(0,2)).trim();
            const restSymbols:string = line.substr(2);
            switch (command) {
                case 'vn':
                    objInstalce.vn_arr.push(this.readPoint3(restSymbols));
                    break;
                case 'vt':
                    objInstalce.vt_arr.push(this.readPoint2(restSymbols));
                    break;
                case 'v':
                    objInstalce.v_arr.push(this.readPoint3(restSymbols));
                    break;
                case 'f':
                    objInstalce.f_arr.push(this.readFace(restSymbols));
                    break;
            }
        });
        console.log(objInstalce);
        return objInstalce;
    }


    private calcNormal(p1:Point3,p2:Point3,p3:Point3):Point3 {
        const a:Point3 = {
            x:p2.x-p1.x,
            y:p2.y-p1.y,
            z:p2.z-p1.z,
        };
        const b:Point3 = {
            x:p3.x-p1.x,
            y:p3.y-p1.y,
            z:p3.z-p1.z,
        };
        const n:Point3 = {
            x:a.y*b.z - a.z*b.y,
            y:a.z*b.x - a.x*b.z,
            z:a.x*b.y - a.y*b.x
        };
        const l:number = Math.sqrt(n.x*n.x+n.y*n.y+n.z*n.z);
        n.x/=l;
        n.y/=l;
        n.z/=l;

        return n;
    }

}
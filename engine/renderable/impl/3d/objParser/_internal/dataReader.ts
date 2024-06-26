import {DebugError} from "@engine/debug/debugError";
import {IPoint3d} from "@engine/geometry/point3d";
import {IPoint2d} from "@engine/geometry/point2d";
import {Face, ObjMeshMaterial, t_obj, t_vertexLib} from "@engine/renderable/impl/3d/objParser/_internal/types";
import {IObjParams} from "@engine/renderable/impl/3d/objParser/objParser";
import {Optional} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/common/texture";
import {Color} from "@engine/renderer/common/color";
import {isNumber} from "@engine/misc/object";

abstract class AbstractDataReader {
    protected parseLine(line:string):{commandName:string|undefined,commandArgs:string[]} {
        line = line.trim();
        if (!line.length) return {commandArgs:undefined!,commandName:undefined};
        const tokens:string[] = line.split(' ').filter(it=>!!it);
        if (!tokens.length) return {commandArgs:undefined!,commandName:undefined}; // string with only spaces
        const [commandName,...commandArgs] = tokens;
        return {commandName,commandArgs};
    }
}

export interface IVertexColor {
    r:number;
    g:number;
    b:number;
    a:number;
}

class DataMtlReader extends AbstractDataReader{

    constructor(private source:string) {
        super();
    }

    private materials:ObjMeshMaterial[] = [];
    private currentMaterial:ObjMeshMaterial = new ObjMeshMaterial('');

    private static readColor(s:string[]):IColor {
        if (s.length<3) throw new DebugError(`wrong color: ${s.join(' ')}`);
        const color:IColor = {
            r: ~~(parseFloat(s[0])*255) as Uint8,
            g: ~~(parseFloat(s[1])*255) as Uint8,
            b: ~~(parseFloat(s[2])*255) as Uint8,
        };
        if (Number.isNaN(color.r) || Number.isNaN(color.g) || Number.isNaN(color.b)) throw new Error(`unexpected line ${s.join(' ')}`);
        return color;
    }

    private static readSpecular(s:string):number {
        const specular:number = parseFloat(s)/1000;
        if (Number.isNaN(specular)) throw new DebugError(`wrong specular value: ${s}`);
        return specular;
    }

    private newMaterial(name:string):void {
        this.currentMaterial = new ObjMeshMaterial(name);
        this.materials.push(this.currentMaterial);
    }

    public readSource():ObjMeshMaterial[]{
        this.source.split('\n').forEach((line:string)=> {
            const {commandName,commandArgs} = this.parseLine(line);
            if (commandName===undefined) return;
            switch (commandName) {
                case 'newmtl':
                    this.newMaterial(commandArgs.join(' '));
                    break;
                case 'Kd':
                    const color = DataMtlReader.readColor(commandArgs);
                    this.currentMaterial.diffuseColor = Color.from(color);
                    break;
                case 'Ns':
                    const specular:number = DataMtlReader.readSpecular(commandArgs.join(''));
                    this.currentMaterial.specular = specular;
                    break;
                case 'd':
                    const alpha:number = +commandArgs;
                    this.currentMaterial.opacity = isNumber(alpha)?alpha:1;
                    break;
            }
        });
        return this.materials;
    }

}

export class DataObjReader extends AbstractDataReader {

    private materialsMap:Record<string, ObjMeshMaterial> = {};
    private readonly vertexSource:string;
    private readonly materialSource:Optional<string>;
    private texture:Optional<ITexture>;

    constructor(params:IObjParams) {
        super();
        this.vertexSource = params.meshData;
        this.materialSource = params.materialsData;
        this.texture = params.texture;
    }

    private vertexLib:t_vertexLib = {
        v_arr:[],
        vn_arr:[],
        vt_arr:[],
        vCol_arr:[],
    };

    private objs:t_obj[] = [];
    private currentObject:t_obj;

    private static readFaceTriplet(triplet:string):[number,number,number]{
        const tripletArr:string[] = triplet.trim().split('/');
        const n1 = parseInt(tripletArr[0]);
        const n2 = parseInt(tripletArr[1]);
        const n3 = parseInt(tripletArr[2]);
        return [n1,n2,n3];
    }

    private static readIPoint3d(s:string[]):IPoint3d{
        if (s.length!==3) throw new DebugError(`wrong point 3d line:${s.join(' ')}`);
        const point:IPoint3d = {
            x:parseFloat(s[0]),
            y:parseFloat(s[1]),
            z:parseFloat(s[2]),
        };
        if (Number.isNaN(point.x) || Number.isNaN(point.y) || Number.isNaN(point.z)) throw new Error(`unexpected line ${s.join(' ')}`);
        return point;
    }

    private static readIPoint3dWithPossibleColor(s:string[]):{point:IPoint3d,color?:IVertexColor}{
        if (s.length<3) throw new DebugError(`wrong point 3d line:${s.join(' ')}`);
        const point:IPoint3d = {
            x:parseFloat(s[0]),
            y:parseFloat(s[1]),
            z:parseFloat(s[2]),
        };
        let color:Optional<IVertexColor>;
        if (s[3] && s[4] && s[5]) {
            color = {
                r:parseFloat(s[3]),
                g:parseFloat(s[4]),
                b:parseFloat(s[5]),
                a:s[6]?parseFloat(s[6]):1.,
            };
        }
        if (Number.isNaN(point.x) || Number.isNaN(point.y) || Number.isNaN(point.z)) throw new Error(`unexpected line ${s.join(' ')}`);
        if (color!==undefined) {
            if (Number.isNaN(color.r) || Number.isNaN(color.g) || Number.isNaN(color.b) || Number.isNaN(color.a)) throw new Error(`unexpected line ${s.join(' ')}`);
        }
        return {point,color};
    }

    private static readIPoint2d(s:string[]):IPoint2d{
        if (s.length<2) throw new DebugError(`wrong point 2d line:${s.join(' ')}`);
        const point:IPoint2d = {
            x:parseFloat(s[0]),
            y:parseFloat(s[1]),
        };
        if (Number.isNaN(point.x) || Number.isNaN(point.y)) throw new Error(`unexpected line ${s.join(' ')}`);
        return point;
    }

    private getFace(triplets:string[]):Face{
        const face:Face = [
            {v:NaN,uv:NaN,n:NaN},
            {v:NaN,uv:NaN,n:NaN},
            {v:NaN,uv:NaN,n:NaN},
        ] as Face;
        triplets.forEach((triplet:string,i:number)=>{
            const tripletNum:[number,number,number] = DataObjReader.readFaceTriplet(triplet);
            face[i].v = tripletNum[0];
            face[i].uv = tripletNum[1];
            face[i].n = tripletNum[2];
            if (Number.isNaN(face[i].v)) throw new Error(`bad face value ${triplets.join(' ')}`);

            if (face[i].v<0) face[i].v = this.vertexLib.v_arr.length + face[i].v + 1;
            if (face[i].uv<0) face[i].uv = this.vertexLib.vt_arr.length + face[i].uv + 1;
            if (face[i].n<0) face[i].n = this.vertexLib.vn_arr.length + face[i].n + 1;

        });
        return face;
    }

    private readFace(triplets:string[]):Face[]{

        const result:Face[] = [];

        if (triplets.length===3) {
            result.push(this.getFace(triplets));
        } else if (triplets.length===4) {
            result.push(this.getFace([triplets[0],triplets[1],triplets[2]]));
            result.push(this.getFace([triplets[0],triplets[2],triplets[3]]));
        } else { // fan
            result.push(this.getFace([triplets[0],triplets[1],triplets[2]]));
            for (let i:number=2;i<triplets.length-1;i++) {
                result.push(this.getFace([triplets[0],triplets[i],triplets[i+1]]));
            }
        }

        return result;
    }

    private newObject(name:string):void{
        if (this.currentObject===undefined) {
            this.currentObject = {f_arr:[],name,material:new ObjMeshMaterial('')};
            this.objs.push(this.currentObject);
        }
        if (this.currentObject.f_arr.length===0) {
            this.currentObject.name = name;
            return;
        }
        this.currentObject = {f_arr:[],name,material:new ObjMeshMaterial('')};
        this.objs.push(this.currentObject);
    }

    private readMaterials():void{
        if (this.materialSource===undefined) return;
        const mtlReader = new DataMtlReader(this.materialSource);
        const materials = mtlReader.readSource();
        for (const m of materials) {
            this.materialsMap[m.name] = m;
        }
    }

    public readSource():{vertexLib:t_vertexLib,objs:t_obj[]}{
        this.readMaterials();
        this.newObject('');
        this.vertexSource.split('\n').forEach((line:string)=>{
            const {commandName,commandArgs} = this.parseLine(line);
            if (commandName===undefined) return;
            switch (commandName) {
                case 'o':
                    this.newObject(commandArgs.join(' '));
                    break;
                case 'vn':
                    this.vertexLib.vn_arr.push(DataObjReader.readIPoint3d(commandArgs));
                    break;
                case 'vt':
                    this.vertexLib.vt_arr.push(DataObjReader.readIPoint2d(commandArgs));
                    break;
                case 'v':
                    const vertex = DataObjReader.readIPoint3dWithPossibleColor(commandArgs);
                    this.vertexLib.v_arr.push(vertex.point);
                    if (vertex.color) this.vertexLib.vCol_arr.push(vertex.color);
                    break;
                case 'f':
                    this.currentObject.f_arr.push(...this.readFace(commandArgs));
                    break;
                case 'usemtl':
                    const mtlName:string = commandArgs.join(' ');
                    const currentMtl = this.materialsMap[mtlName];
                    if (currentMtl!==undefined) {
                        this.currentObject.material.diffuseColor = currentMtl.diffuseColor;
                        this.currentObject.material.opacity = currentMtl.opacity;
                    } else {
                        console.warn(`unknown material: ${mtlName}`);
                    }
                    break;
                case 'mtllib':
                    // already processed
                // eslint-disable-next-line no-fallthrough
                case 's':
                    // smooth flag, not supported
                    break;
                default:
                    if (commandName.trim().startsWith('#')) break; // skip comment line
                    console.warn(`unknown command: ${commandName} (line:${line})`);
            }
        });
        return {vertexLib:this.vertexLib,objs:this.objs};
    }

}

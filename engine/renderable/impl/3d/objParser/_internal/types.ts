import {IPoint3d} from "@engine/geometry/point3d";
import {IPoint2d} from "@engine/geometry/point2d";
import {Color} from "@engine/renderer/common/color";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {IVertexColor} from "@engine/renderable/impl/3d/objParser/_internal/dataReader";

export interface FacePoint {
   v: number;
   uv:number;
   n:number;
}
export type Face = [FacePoint,FacePoint,FacePoint];

export type t_vertexLib = {
    v_arr:IPoint3d[],
    vn_arr:IPoint3d[],
    vt_arr:IPoint2d[]
    vCol_arr:IVertexColor[];
};


export class MeshMaterial {
    public ambientColor:IColor = Color.WHITE.clone();
    public specular:number = 1;

    constructor(public name:string) {
    }
}

export type t_obj = {
    f_arr:Face[],
    name:string,
    material:MeshMaterial;
};

export class ObjPrimitive extends AbstractPrimitive {
    constructor(){
        super();
        this.vertexArr = [];
        this.normalArr = [];
        this.texCoordArr = [];
        this.indexArr = [];
    }
}

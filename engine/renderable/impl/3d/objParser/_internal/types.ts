import {IPoint3d} from "@engine/geometry/point3d";
import {IPoint2d} from "@engine/geometry/point2d";
import {Color} from "@engine/renderer/common/color";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {IVertexColor} from "@engine/renderable/impl/3d/objParser/_internal/dataReader";
import {MeshMaterial} from "@engine/renderable/impl/3d/meshMaterial";

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


export class ObjMeshMaterial extends MeshMaterial {
    public opacity = 1;
    constructor(public name:string) {
        super();
        this.diffuseColor = Color.WHITE.clone();
        this.specular = 1;
    }
}

export type t_obj = {
    f_arr:Face[],
    name:string,
    material:ObjMeshMaterial;
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

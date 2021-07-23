import {IPoint3d} from "@engine/geometry/point3d";
import {IPoint2d} from "@engine/geometry/point2d";
import {calcNormal} from "@engine/renderable/impl/geometry/_internal/calcNormal";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ObjPrimitive, t_obj, t_vertexLib} from "@engine/renderable/impl/3d/objParser/_internal/types";
import {DataObjReader, IVertexColor} from "@engine/renderable/impl/3d/objParser/_internal/dataReader";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";

export interface IObjParams {
    meshData:string;
    materialsData?:string;
    texture?:ITexture;
    normalsTexture?:ITexture;
    cubeMapTexture?:ICubeMapTexture;
}

export class ObjParser {

    private static objToPrimitive(game:Game, vertexLib:t_vertexLib, objs:t_obj[],params:IObjParams):SimpleGameObjectContainer{
        const container = new SimpleGameObjectContainer(game);
        for (const obj of objs) {
            const pr:ObjPrimitive = new ObjPrimitive();
            pr.vertexColorArr = [];
            container.size.setWH(10);
            let cnt:number = 0;
            for (const f of obj.f_arr) {
                const vert1:IPoint3d = vertexLib.v_arr[f[0].v-1];
                const vert2:IPoint3d = vertexLib.v_arr[f[1].v-1];
                const vert3:IPoint3d = vertexLib.v_arr[f[2].v-1];

                let norm1:IPoint3d = vertexLib.vn_arr[f[0].n-1];
                let norm2:IPoint3d = vertexLib.vn_arr[f[1].n-1];
                let norm3:IPoint3d = vertexLib.vn_arr[f[2].n-1];

                if (!norm1) {
                    norm1 = calcNormal(vert1,vert2,vert3);
                    norm2 = {...norm1};
                    norm3 = {...norm1};
                }

                if (
                    vertexLib.vCol_arr[f[0].v-1]!==undefined
                ) {
                    const vertexColor1:IVertexColor = vertexLib.vCol_arr[f[0].v-1];
                    const vertexColor2:IVertexColor = vertexLib.vCol_arr[f[1].v-1];
                    const vertexColor3:IVertexColor = vertexLib.vCol_arr[f[2].v-1];
                    pr.vertexColorArr.push(
                        vertexColor1.r,vertexColor1.g,vertexColor1.b,vertexColor1.a,
                        vertexColor2.r,vertexColor2.g,vertexColor2.b,vertexColor2.a,
                        vertexColor3.r,vertexColor3.g,vertexColor3.b,vertexColor3.a,
                    );
                }

                const tex1:IPoint2d = vertexLib.vt_arr[f[0].uv-1];
                const tex2:IPoint2d = vertexLib.vt_arr[f[1].uv-1];
                const tex3:IPoint2d = vertexLib.vt_arr[f[2].uv-1];


                pr.vertexArr.push(
                    vert1.x,vert1.y,vert1.z,
                    vert2.x,vert2.y,vert2.z,
                    vert3.x,vert3.y,vert3.z,
                );

                if (norm1) {
                    pr.normalArr!.push(
                        norm1.x,norm1.y,norm1.z,
                        norm2.x,norm2.y,norm2.z,
                        norm3.x,norm3.y,norm3.z,
                    );
                }

                if (tex1) {
                    pr.texCoordArr!.push(
                        tex1.x,tex1.y,
                        tex2.x,tex2.y,
                        tex3.x,tex3.y,
                    );
                }

                pr.indexArr!.push(cnt++,cnt++,cnt++);
            }
            if (!pr.indexArr!.length) pr.indexArr = undefined;
            if (!pr.texCoordArr!.length) pr.texCoordArr = undefined;
            if (!pr.normalArr!.length) pr.normalArr = undefined;
            if (!pr.vertexColorArr!.length) pr.vertexColorArr = undefined;

            const model3d:Model3d = new Model3d(game,pr);
            model3d.fillColor.set(obj.material.ambientColor);
            model3d.id = obj.name;
            model3d.cubeMapTexture = params.cubeMapTexture;
            container.appendChild(model3d);

            if (pr.texCoordArr!==undefined) {
                model3d.texture = params.texture;
            }
            if (pr.normalArr!==undefined) {
                model3d.normalsTexture = params.normalsTexture;
            }

        }
        return container;
    }

    private static readObj(params:IObjParams):{vertexLib:t_vertexLib,objs:t_obj[]}{
        return new DataObjReader(params).readSource();
    }

    public parse(game:Game,params:IObjParams):SimpleGameObjectContainer{
        const primitivesData = ObjParser.readObj(params);
        return ObjParser.objToPrimitive(game,primitivesData.vertexLib,primitivesData.objs,params);
    }

}


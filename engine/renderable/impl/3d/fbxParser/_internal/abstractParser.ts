import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {FbxReader} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxReader";
import {FBXNode} from "@engine/renderable/impl/3d/fbxParser/_internal/shared";
import {ObjPrimitive} from "@engine/renderable/impl/3d/objParser/_internal/types";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {MathEx} from "@engine/misc/mathEx";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";

export interface IFbxParams {
    texture?:ITexture;
    normalsTexture?:ITexture;
    cubeMapTexture?:ICubeMapTexture;
}

type ReferenceType = 'Direct'|'IndexToDirect';
type MappingType = 'ByPolygon'|'ByPolygonVertex'|'ByVertex'|'ByVertice'|'ByEdge'|'AllSame';

const _findNodes = (node:FBXNode,name:string,out:FBXNode[]):FBXNode[]=>{
    if (!node) return out;
    if (node.name===name) out.push(node);
    node.nodes.forEach(n=>_findNodes(n,name,out));
    return out;
}
const findNodes = (node:FBXNode,name:string):FBXNode[] => {
    const out:FBXNode[] = [];
    _findNodes(node,name,out);
    return out;
}
const findNode = (node:FBXNode,name:string):FBXNode=>{
    return findNodes(node,name)[0];
}

const findProperty = (node:FBXNode,path:string)=>{
    const pathSegments = path.split('/');
    for (let i = 0; i < pathSegments.length; i++) {
        const pathSegment = pathSegments[i];
        node = findNode(node,pathSegment);
    }
    return node?.props?.[0] as any;
}

const findFaces = (indices:number[]):number[][]=> {
    const faces:number[][] = [];
    let currFace:number[] = [];
    for (let i=0;i<indices.length;i++) {
        let inx = indices[i];
        if (inx<0) {
            inx = ~inx;
            currFace.push(inx);
            faces.push(currFace);
            currFace = [];
        } else {
            currFace.push(inx);
        }
    }
    return faces;
}

const getVertexByIndex = (index:number,vertexSize:number,vertices:number[]):[number,number,number]=>{
    const pos = index*vertexSize;
    return [
        vertices[pos],
        vertices[pos+1],
        vertices[pos+2],
    ]
}

export abstract class AbstractParser {

    private readonly container:RenderableModel;
    private unitScaleFactor:number = 1;

    protected constructor(private game:Game,private reader:FbxReader) {
        this.container = new SimpleGameObjectContainer(game);
        this._parse();
    }

    private _parseGlobalSettings():void {
        const globalSettings = findNode(this.reader.rootNode,'GlobalSettings');
        const properties = findNode(globalSettings,'Properties70');
        if (!properties) return;
        properties.nodes.forEach(n=>{
            if (n.props[0]==='UnitScaleFactor') {
                this.unitScaleFactor = n.props[4] as number ?? 1;
            }
        });
    }

    private _parseGeometries():ObjPrimitive[]{
        const result:ObjPrimitive[] = [];
        findNodes(this.reader.rootNode,'Objects').forEach(o=>{
            findNodes(o,'Geometry').forEach((g,i)=>{
                //https://banexdevblog.wordpress.com/2014/06/23/a-quick-tutorial-about-the-fbx-ascii-format/amp/#top

                const uuid:number = g.props[0] as number;
                const name = ((g.props[1] || '') as string).replace('Geometry::','');

                const vertices:number[] = findProperty(g,'Vertices');
                const indices:number[] = findProperty(g,'PolygonVertexIndex');
                const normals:number[] = findProperty(g,'LayerElementNormal/Normals');
                const normalReferenceType:ReferenceType = findProperty(g,'LayerElementNormal/ReferenceInformationType')
                const normalMappingType:MappingType = findProperty(g,'LayerElementNormal/MappingInformationType')
                const faces:number[][] = findFaces(indices);

                //console.log(findNode(g,'LayerElementNormal'));
                //console.log({normalReferenceType,normalMappingType});
                if (normalMappingType!=='ByPolygonVertex') throw new Error(`not supported: ${normalMappingType}`)
                if (normalReferenceType!=='Direct') throw new Error(`not supported: ${normalReferenceType}`)

                const verticesProcessed:number[] = [];
                const normalsProcessed:number[] = []; // ByPolygonVertex

                if (i===0) console.log({name,faces,normals,vertices,indices});

                let faceVertexIndex = 0;
                for (let i = 0; i < faces.length; i++) {
                    const face:number[] = faces[i];
                    // first triangle
                    verticesProcessed.push(
                        ...getVertexByIndex(face[0],3,vertices),
                        ...getVertexByIndex(face[1],3,vertices),
                        ...getVertexByIndex(face[2],3,vertices),
                    );
                    const i0 = faceVertexIndex;
                    const i1 = faceVertexIndex+1;
                    const i2 = faceVertexIndex+2;

                    normalsProcessed.push(
                        ...getVertexByIndex(i0,3,normals),
                        ...getVertexByIndex(i1,3,normals),
                        ...getVertexByIndex(i2,3,normals),
                    )
                    faceVertexIndex+=3;
                    if (face.length>3) {  // polygon (fan)
                        for (let j:number=2;j<face.length-1;j++) {
                            verticesProcessed.push(
                                ...getVertexByIndex(face[0],3,vertices),
                                ...getVertexByIndex(face[j],3,vertices),
                                ...getVertexByIndex(face[j+1],3,vertices),
                            );
                            const i1n = faceVertexIndex-1;
                            const i2n = faceVertexIndex;
                            faceVertexIndex++;
                            normalsProcessed.push(
                                ...getVertexByIndex(i0,3,normals),
                                ...getVertexByIndex(i1n,3,normals),
                                ...getVertexByIndex(i2n,3,normals),
                            )
                        }
                    }
                }

                const pr:ObjPrimitive = new ObjPrimitive();
                pr.vertexArr = verticesProcessed;
                pr.indexArr = undefined;
                pr.normalArr = normalsProcessed;
                pr.texCoordArr = undefined;
                result.push(pr);
            });
        });
        return result;
    }

    private _parseModels():SimpleGameObjectContainer[] {
        const res:SimpleGameObjectContainer[] = [];
        findNodes(this.reader.rootNode,'Objects').forEach(o=>{
            findNodes(o,'Model').forEach(m=>{
                const name = (m.props[1] as string || '').replace('Model::','');
                const m3dContainer = new SimpleGameObjectContainer(this.game);
                res.push(m3dContainer);

                const translationNode = new SimpleGameObjectContainer(this.game);
                const rotationNode = new SimpleGameObjectContainer(this.game);
                const scaleNode = new SimpleGameObjectContainer(this.game);

                m3dContainer.appendChild(translationNode);
                translationNode.appendChild(rotationNode);
                rotationNode.appendChild(scaleNode);
                scaleNode.id = 'lastNode';

                m3dContainer.id = name;
                const propNodes = findNode(m,'Properties70');
                propNodes.nodes.forEach(pn=>{
                    if (pn.props[0]==='Lcl Translation') {
                        translationNode.pos.setXYZ(
                            pn.props[4] as number,
                            pn.props[5] as number,
                            -pn.props[6] as number, // -
                        );
                        console.log('translation',pn.props[4],pn.props[5],pn.props[6]);
                    } else if (pn.props[0]==='Lcl Rotation') {
                        rotationNode.angle3d.setXYZ(
                            MathEx.degToRad(pn.props[4] as number),
                            MathEx.degToRad(pn.props[5] as number),
                            -MathEx.degToRad(pn.props[6] as number) // -
                        );
                        console.log('rotation',pn.props[4],pn.props[5],pn.props[6]);
                    } else if (pn.props[0]==='Lcl Scaling') {
                        scaleNode.scale.setXYZ(
                            pn.props[4] as number / this.unitScaleFactor,
                            pn.props[5] as number / this.unitScaleFactor,
                            pn.props[6] as number / this.unitScaleFactor
                        );
                        console.log('scale',pn.props[4],pn.props[5],pn.props[6]);
                    }
                });
            });
        });
        return res;
    }

    private _parse():void {
        console.log(this.reader.rootNode);
        this._parseGlobalSettings();
        console.log('unitScaleFactor',this.unitScaleFactor);

        const geometries = this._parseGeometries();
        const models = this._parseModels();

        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            const geometry = geometries[i];
            if (!geometry) break;

            const model3d = new Model3d(this.game,geometry);
            model3d.fillColor.setRGB(MathEx.randomByte(),MathEx.randomByte(),MathEx.randomByte());
            model.findChildById('lastNode')!.appendChild(model3d);
            this.container.appendChild(model);
        }
    }

    public getModel():RenderableModel {
        return this.container;
    }

}

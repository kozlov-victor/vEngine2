import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {FbxReader} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxReader";
import {FBXNode} from "@engine/renderable/impl/3d/fbxParser/_internal/shared";
import {ObjPrimitive} from "@engine/renderable/impl/3d/objParser/_internal/types";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {MathEx} from "@engine/misc/mathEx";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {MeshMaterial} from "@engine/renderable/impl/3d/meshMaterial";

export interface IFbxParams {
    texture?:ITexture;
    normalsTexture?:ITexture;
    cubeMapTexture?:ICubeMapTexture;
}

interface IMaterial {
    color: IColor;
    specular: number;
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

const findProperty70 = (node:FBXNode,name:string):undefined|any[]=>{
    for (const nodeElement of node.nodes) {
        if (nodeElement.props[0]===name) return nodeElement.props as any[];
    }
    return undefined;
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
        vertices[pos+2],
        vertices[pos+0],
        vertices[pos+1],
    ]
}

interface IFbxNode {
    tag: string;
    uuid:number;
}

class FbxModel3d extends Model3d implements IFbxNode{
    public tag:string;
    public uuid:number;
}

class FbxModelContainer extends SimpleGameObjectContainer  implements IFbxNode{
    public tag:string;
    public uuid:number;
}

class FbxMaterial extends MeshMaterial  implements IFbxNode {
    public tag:string;
    public uuid:number;
}

export abstract class AbstractParser {

    private readonly container:FbxModelContainer;
    private unitScaleFactor:number = 1;
    private upAxisSign:number = 1; // UpAxis +Z, FrontAxis -Y, CoordAxis +X.
    private frontAxisSign:number = 1;
    private coordAxisSign:number = 1;

    private upAxis:number = 1;
    private frontAxis:number = 0;
    private coordAxis:number = 2;

    protected constructor(private game:Game,private reader:FbxReader) {
        this.container = new FbxModelContainer(game);
        this.container.tag = 'root';
        this.container.uuid = 0;
        this._parse();
    }

    private _parseGlobalSettings():void {
        const globalSettings = findNode(this.reader.rootNode,'GlobalSettings');
        const properties70 = findNode(globalSettings,'Properties70');
        if (!properties70) return;
        const scaleFactor = findProperty70(properties70,'UnitScaleFactor');
        if (scaleFactor) {
            this.unitScaleFactor = scaleFactor[4] as number ?? 1;
        }
        const upAxis = findProperty70(properties70,'UpAxis');
        const frontAxis = findProperty70(properties70,'FrontAxis');
        const coordAxis = findProperty70(properties70,'CoordAxis');
        this.upAxis = upAxis?.[4] ?? this.upAxis;
        this.frontAxis = frontAxis?.[4] ?? this.frontAxis;
        this.coordAxis = coordAxis?.[4] ?? this.coordAxis;

        const upAxisSign = findProperty70(properties70,'UpAxisSign');
        const frontAxisSign = findProperty70(properties70,'FrontAxisSign');
        const coordAxisSign = findProperty70(properties70,'CoordAxisSign');
        this.upAxisSign = upAxisSign?.[4] || this.upAxisSign;
        this.frontAxisSign = frontAxisSign?.[4] || this.frontAxisSign;
        this.coordAxisSign = coordAxisSign?.[4] || this.coordAxisSign;
    }

    private _parseGeometries():FbxModel3d[]{
        const result:FbxModel3d[] = [];
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

                let faceVertexIndex = 0;
                for (let i = 0; i < faces.length; i++) {
                    const face:number[] = faces[i];
                    if (face.length<3) throw new Error(`wrong face`);

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

                const pr = new ObjPrimitive();
                pr.vertexArr = verticesProcessed;
                pr.indexArr = undefined;
                pr.normalArr = normalsProcessed;
                pr.texCoordArr = undefined;

                const model3d = new FbxModel3d(this.game,pr);
                model3d.material.diffuseColor.setRGB(0xff);
                model3d.tag = name;
                model3d.uuid = uuid;
                result.push(model3d);
            });
        });
        return result;
    }

    private _parseModels():FbxModelContainer[] {
        const res:FbxModelContainer[] = [];
        findNodes(this.reader.rootNode,'Objects').forEach(o=>{
            findNodes(o,'Model').forEach(m=>{
                const uuid = m.props[0] as number;
                const name = (m.props[1] as string || '').replace('Model::','');
                const modelContainer = new FbxModelContainer(this.game);
                res.push(modelContainer);

                modelContainer.uuid = uuid;
                modelContainer.tag = name;
                const properties70 = findNode(m,'Properties70');
                const translation = findProperty70(properties70,'Lcl Translation');
                if (translation) {
                    console.log(modelContainer.tag,translation);
                    const x = (translation[4+2] as number);
                    const y = -(translation[4+0] as number);
                    const z = (translation[4+1] as number);
                    modelContainer.pos.setXYZ(x,y,z);
                }
                const rotation = findProperty70(properties70,'Lcl Rotation');
                if (rotation) {
                    modelContainer.angle3d.setXYZ(
                        -MathEx.degToRad(rotation[4+2] as number),
                        MathEx.degToRad(rotation[4+0] as number),
                        MathEx.degToRad(rotation[4+1] as number) // -
                    );
                }
                const scale = findProperty70(properties70,'Lcl Scaling');
                if (scale) {
                    modelContainer.scale.setXYZ(
                        scale[4+2] as number / this.unitScaleFactor,
                        scale[4+0] as number / this.unitScaleFactor,
                        scale[4+1] as number / this.unitScaleFactor
                    );
                }
            });
        });
        return res;
    }

    private _parseMaterials():FbxMaterial[] {
        const result:FbxMaterial[] = [];
        findNodes(this.reader.rootNode,'Material').forEach(m=>{
            const uuid = m.props[0] as number;
            const name = ((m.props[1] || '') as string).replace('Material::','');
            const material = new FbxMaterial();
            material.tag = name;
            material.uuid = uuid;
            const properties70 = findNode(m,'Properties70');
            const diffuseColor = findProperty70(properties70,'DiffuseColor');
            if (diffuseColor) {
                material.diffuseColor.setRGB(
                    ~~(diffuseColor[4]*0xff) as Uint8,
                    ~~(diffuseColor[5]*0xff) as Uint8,
                    ~~(diffuseColor[6]*0xff) as Uint8
                );
            }
            result.push(material);
        });
        return result;
    }

    private _parseConnections():[number,number][] {
        const result:[number,number][] = [];
        const connections = findNode(this.reader.rootNode,'Connections');
        if (!connections) return result;
        connections.nodes.forEach(c=>{
            const cn:[number,number] = [
                c.props[1] as  number,
                c.props[2] as number
            ];
            result.push(cn);
        });
        return result;
    }

    private _applyMaterialsToGeometries(geometries:FbxModel3d[],materials:FbxMaterial[],connections:[number,number][]):void {
        const materialIds = materials.map(it=>it.uuid);
        geometries.forEach(g=> {
            const connectionPair = connections.find(c => c[0] === g.uuid);
            if (!connectionPair) return;
            const materialId = (connections.filter(c=>c[1]===connectionPair[1]).filter(c=>materialIds.includes(c[0])))[0]?.[0];
            if (!materialId) return;
            const material = materials.find(g => g.uuid === materialId);
            if (!material) return;
            g.material = material.clone();
        });
    }

    private _applyGeometriesToModels(geometries:FbxModel3d[],models:FbxModelContainer[],connections:[number,number][]):void {
        geometries.forEach(g=>{
            const connectionPair = connections.find(c => c[0] === g.uuid);
            if (!connectionPair) return;
            const model = models.find(it=>it.uuid===connectionPair[1]);
            if (!model) return;
            model.appendChild(g);
        });
    }

    private _buildModelGraph(models:FbxModelContainer[],connections:[number,number][]):void {
        models.forEach(m=>{
            const connectionPair = connections.find(c => c[0] === m.uuid);
            if (!connectionPair) return;
            const parentModel = connectionPair[1]===0?
                this.container:
                models.find(it=>it.uuid===connectionPair[1]);
            if (!parentModel) return;
            parentModel.appendChild(m);
        });
    }

    private _parse():void {
        console.log(this.reader.rootNode);
        this._parseGlobalSettings();
        console.log('unitScaleFactor',this.unitScaleFactor);

        const geometries = this._parseGeometries();
        const models = this._parseModels();
        const materials = this._parseMaterials();
        const connections = this._parseConnections();
        this._applyMaterialsToGeometries(geometries,materials,connections);
        this._applyGeometriesToModels(geometries,models,connections);
        this._buildModelGraph(models,connections);
    }

    public getModel():RenderableModel {
        return this.container;
    }

}

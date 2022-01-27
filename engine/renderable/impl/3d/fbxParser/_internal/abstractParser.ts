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
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Optional} from "@engine/core/declarations";

export interface IFbxParams {
    textures?:Record<string, ITexture>;
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

const findProperty70 = (node:FBXNode,name:string):undefined|any[]=>{
    for (const nodeElement of node.nodes) {
        if (nodeElement.props[0]===name) return nodeElement.props as any[];
    }
    return undefined;
}

const findFaces = (indices:readonly number[]):number[][]=> {
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

const getVertex3ByIndex = (index:number,vertices:readonly number[]):[number,number,number]=>{
    const pos = index*3;
    return [
        vertices[pos+2],
        vertices[pos+0],
        vertices[pos+1],
    ]
}

const getVertex2ByIndex = (index:number,vertices:readonly number[],indices?:readonly number[]):[number,number]=>{
    // byVertex or byVertexIndex
    if (indices) {
        index = indices[index];
    }
    const pos = index*2;
    return [
        vertices[pos+0],
        vertices[pos+1],
    ];
}

const extractNameWithoutExtension = (name:string):string=>{
    const segments = name.split('.');
    if (segments.length===0) return name;
    segments.pop();
    return segments.join('.');
};

interface IFbxNode {
    tag: string;
    uuid:number;
}

class FbxModel3d extends Model3d implements IFbxNode{
    public tag:string;
    public uuid:number;

    protected override setClonedProperties(cloned: FbxModel3d) {
        super.setClonedProperties(cloned);
        cloned.tag = this.tag;
        cloned.uuid = this.uuid;
    }

    public override clone(): FbxModel3d {
        const cloned:FbxModel3d = new FbxModel3d(this.game,this._modelPrimitive,this._bufferInfo);
        this.setClonedProperties(cloned);
        return cloned;
    }

}

class FbxModelContainer extends SimpleGameObjectContainer  implements IFbxNode{
    public tag:string;
    public uuid:number;
}

class FbxMaterial extends MeshMaterial implements IFbxNode {
    public tag:string;
    public uuid:number;

    protected override setClonedProperties(cloned: FbxMaterial) {
        super.setClonedProperties(cloned);
        cloned.tag = this.tag;
        cloned.uuid = this.uuid;
    }

    public override clone(): FbxMaterial {
        const cloned:FbxMaterial = new FbxMaterial();
        this.setClonedProperties(cloned);
        return cloned;
    }

}

class FbxTexture implements IFbxNode {
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

    protected constructor(private game:Game,private reader:FbxReader,private params:IFbxParams) {
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

                const vertices:readonly number[] = findProperty(g,'Vertices');
                const indices:readonly number[] = findProperty(g,'PolygonVertexIndex');
                const normals:readonly number[] = findProperty(g,'LayerElementNormal/Normals');
                const normalReferenceType:ReferenceType = findProperty(g,'LayerElementNormal/ReferenceInformationType');
                const normalMappingType:MappingType = findProperty(g,'LayerElementNormal/MappingInformationType');
                const faces:number[][] = findFaces(indices);

                const uvs:readonly number[] = findProperty(g,'LayerElementUV/UV');
                const uvIndices:readonly number[] = findProperty(g,'LayerElementUV/UVIndex');
                const uvReferenceType:ReferenceType = findProperty(g,'LayerElementUV/ReferenceInformationType')
                const uvMappingType:MappingType = findProperty(g,'LayerElementUV/MappingInformationType')
                const useTexture = uvs!==undefined && uvs.length>0;

                //console.log({vertices,indices,normals,uvs,uvIndices});

                if (normalMappingType!=='ByPolygonVertex') throw new Error(`normalMappingType is not supported: ${normalMappingType}`);
                if (normalReferenceType!=='Direct') throw new Error(`normalReferenceType is not supported: ${normalReferenceType}`);

                if (useTexture) {
                    if (uvMappingType!=='ByPolygonVertex') throw new Error(`uvReferenceType is not supported: ${uvReferenceType}`);
                    if (uvReferenceType!=='IndexToDirect') throw new Error(`uvMappingType is not supported: ${uvMappingType}`);
                }

                const verticesProcessed:number[] = [];
                const normalsProcessed:number[] = [];
                const uvsProcessed:number[] = [];

                let faceVertexIndex = 0;
                for (let i = 0; i < faces.length; i++) {
                    const face:number[] = faces[i];
                    if (face.length<3) throw new Error(`wrong face`);


                    // first triangle
                    const i0 = faceVertexIndex;
                    const i1 = faceVertexIndex+1;
                    const i2 = faceVertexIndex+2;
                    verticesProcessed.push(
                        ...getVertex3ByIndex(face[0],vertices),
                        ...getVertex3ByIndex(face[1],vertices),
                        ...getVertex3ByIndex(face[2],vertices),
                    );
                    if (useTexture) {
                        uvsProcessed.push(
                            ...getVertex2ByIndex(i0,uvs,uvIndices),
                            ...getVertex2ByIndex(i1,uvs,uvIndices),
                            ...getVertex2ByIndex(i2,uvs,uvIndices),
                        );
                    }

                    normalsProcessed.push(
                        ...getVertex3ByIndex(i0,normals),
                        ...getVertex3ByIndex(i1,normals),
                        ...getVertex3ByIndex(i2,normals),
                    )
                    faceVertexIndex+=3;
                    if (face.length>3) {  // polygon (fan)
                        for (let j:number=2;j<face.length-1;j++) {
                            verticesProcessed.push(
                                ...getVertex3ByIndex(face[0],vertices),
                                ...getVertex3ByIndex(face[j],vertices),
                                ...getVertex3ByIndex(face[j+1],vertices),
                            );
                            const i1n = faceVertexIndex-1;
                            const i2n = faceVertexIndex;
                            faceVertexIndex++;
                            normalsProcessed.push(
                                ...getVertex3ByIndex(i0,normals),
                                ...getVertex3ByIndex(i1n,normals),
                                ...getVertex3ByIndex(i2n,normals),
                            )
                            if (useTexture) {
                                uvsProcessed.push(
                                    ...getVertex2ByIndex(i0,uvs,uvIndices),
                                    ...getVertex2ByIndex(i1n,uvs,uvIndices),
                                    ...getVertex2ByIndex(i2n,uvs,uvIndices),
                                );
                            }
                        }
                    }
                }

                const pr = new ObjPrimitive();
                pr.vertexArr = verticesProcessed;
                pr.indexArr = undefined;
                pr.normalArr = normalsProcessed;
                if (uvsProcessed.length) pr.texCoordArr = uvsProcessed;
                else pr.texCoordArr = undefined;

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

    private _parseTextures():FbxTexture[] {
        const textures:FbxTexture[] = [];
        findNodes(this.reader.rootNode,'Texture').forEach(t=>{
            const texture = new FbxTexture();
            texture.uuid = t.props[0] as number;
            texture.tag = ((t.props[1] || '') as string).replace('Texture::','');
            textures.push(texture);
        });
        return textures;
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

    private _applyMaterialsToGeometries(geometries:FbxModel3d[],materials:FbxMaterial[],textures:FbxTexture[],connections:[number,number][]):void {
        const materialIds = materials.map(it=>it.uuid);
        geometries.forEach(g=> {
            const connectionPair = connections.find(c => c[0] === g.uuid);
            if (!connectionPair) return;
            const materialId = (connections.filter(c=>c[1]===connectionPair[1]).filter(c=>materialIds.includes(c[0])))[0]?.[0];
            if (!materialId) return;
            const material = materials.find(g => g.uuid === materialId);
            if (!material) return;
            g.material = material.clone();
            const texturesToApply = this._findTextureByMaterialId(materialId,textures,connections);
            if (texturesToApply.length) {
                const tx:Optional<ITexture> = this.params?.textures?.[extractNameWithoutExtension(texturesToApply[0].tag)];
                if (!tx) return;
                g.texture = tx;
            }
        });
    }

    private _findTextureByMaterialId(materialId:number,textures:FbxTexture[],connections:[number,number][]):FbxTexture[] {
        const textureIds = textures.map(it=>it.uuid);
        const result:FbxTexture[] = [];
        connections.forEach(c=>{
            if (c[1]===materialId && textureIds.includes(c[0])) {
                const tx = textures.find(it=>it.uuid===c[0]);
                if (tx) result.push(tx);
            }
        });
        return result;
    }

    private _applyGeometriesToModels(geometries:FbxModel3d[],models:FbxModelContainer[],connections:[number,number][]):void {
        models.forEach(m=>{
            const connectionPairs = connections.filter(c => c[1] === m.uuid);
            connectionPairs.forEach(connectionPair=>{
                let geometry = geometries.find(it=>it.uuid===connectionPair[0]);
                if (!geometry) return;
                geometry = geometry.clone();
                m.appendChild(geometry);
            });
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
        const textures = this._parseTextures();
        const connections = this._parseConnections();
        this._applyMaterialsToGeometries(geometries,materials,textures,connections);
        this._applyGeometriesToModels(geometries,models,connections);
        this._buildModelGraph(models,connections);
    }

    public getModel():RenderableModel {
        return this.container;
    }

}

import {FbxReader} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxReader";
import {ObjPrimitive} from "@engine/renderable/impl/3d/objParser/_internal/types";
import {MathEx} from "@engine/misc/math/mathEx";
import {Game} from "@engine/core/game";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Optional} from "@engine/core/declarations";
import {
    FbxMaterial,
    FbxModel3d,
    FbxModelContainer,
    FbxModelWrapper,
    FbxTexture,
    FbxVideo
} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxNodes";
import {
    IFbxParams,
    ITextureDescription,
    MappingType,
    ReferenceType
} from "@engine/renderable/impl/3d/fbxParser/_internal/types";
import {Utils} from "@engine/renderable/impl/3d/fbxParser/_internal/utils";

export abstract class FbxAbstractParser {

    private readonly container:FbxModelContainer;
    private readonly containerTransformWrap:FbxModelWrapper;
    private unitScaleFactor:number = 1;
    private completed:boolean = false;


    protected constructor(private game:Game,private reader:FbxReader,private params:IFbxParams) {
        this.container = new FbxModelContainer(game);
        this.container.tag = 'root';
        this.container.uuid = 0;
        this.containerTransformWrap = new FbxModelWrapper(game,this.container);
        this.container.angle3d.x = MathEx.degToRad(90);
        this.containerTransformWrap.appendChild(this.container);
    }

    private _parseGlobalSettings():void {
        const globalSettings = Utils.findNode(this.reader.rootNode,'GlobalSettings');
        const properties70 = Utils.findNode(globalSettings,'Properties70') || Utils.findNode(globalSettings,'Properties60');
        if (!properties70) return;
        const scaleFactor = Utils.findProperty70(properties70,'UnitScaleFactor');
        if (scaleFactor) {
            this.unitScaleFactor = scaleFactor[4] as number ?? 1;
        }
    }

    private _parseGeometries():FbxModel3d[]{
        const result:FbxModel3d[] = [];
        Utils.findNodes(this.reader.rootNode,'Objects').forEach(o=>{
            Utils.findNodes(o,'Geometry').forEach((g,i)=>{
                //https://banexdevblog.wordpress.com/2014/06/23/a-quick-tutorial-about-the-fbx-ascii-format/amp/#top

                const uuid:number = g.props[0] as number;
                const name = ((g.props[1] || '') as string).replace('Geometry::','');

                const vertices:readonly number[] = Utils.findProperty(g,'Vertices');
                const vertexIndices:readonly number[] = Utils.findProperty(g,'PolygonVertexIndex');
                const normals:readonly number[] = Utils.findProperty(g,'LayerElementNormal/Normals');
                const normalReferenceType:ReferenceType = Utils.findProperty(g,'LayerElementNormal/ReferenceInformationType');
                const normalMappingType:MappingType = Utils.findProperty(g,'LayerElementNormal/MappingInformationType');
                const faces:number[][] = Utils.findFaces(vertexIndices);

                const uvs:readonly number[] = Utils.findProperty(g,'LayerElementUV/UV');
                const uvIndices:readonly number[] = Utils.findProperty(g,'LayerElementUV/UVIndex');
                const uvReferenceType:ReferenceType = Utils.findProperty(g,'LayerElementUV/ReferenceInformationType')
                const uvMappingType:MappingType = Utils.findProperty(g,'LayerElementUV/MappingInformationType')
                const useTexture = uvs!==undefined && uvs.length>0;

                if (normalReferenceType!=='Direct') throw new Error(`normalReferenceType is not supported: ${normalReferenceType}`);

                if (useTexture) {
                    if (['IndexToDirect','Direct'].indexOf(uvReferenceType)===-1) throw new Error(`uvReferenceType is not supported: ${uvReferenceType}`);
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
                        ...Utils.getVertex3ByIndex(face[0],vertices),
                        ...Utils.getVertex3ByIndex(face[1],vertices),
                        ...Utils.getVertex3ByIndex(face[2],vertices),
                    );
                    if (useTexture) {
                        uvsProcessed.push(
                            ...Utils.getVertex2ByIndexAndMappingType(i0,face[0],uvMappingType,uvs,uvIndices),
                            ...Utils.getVertex2ByIndexAndMappingType(i1,face[1],uvMappingType,uvs,uvIndices),
                            ...Utils.getVertex2ByIndexAndMappingType(i2,face[2],uvMappingType,uvs,uvIndices),
                        );
                    }

                    normalsProcessed.push(
                        ...Utils.getVertex3ByIndexAndMappingType(i0,face[0],normalMappingType,normals),
                        ...Utils.getVertex3ByIndexAndMappingType(i1,face[1],normalMappingType,normals),
                        ...Utils.getVertex3ByIndexAndMappingType(i2,face[2],normalMappingType,normals),
                    )
                    faceVertexIndex+=3;
                    if (face.length>3) {  // polygon (fan)
                        for (let j:number=2;j<face.length-1;j++) {
                            verticesProcessed.push(
                                ...Utils.getVertex3ByIndex(face[0],vertices),
                                ...Utils.getVertex3ByIndex(face[j],vertices),
                                ...Utils.getVertex3ByIndex(face[j+1],vertices),
                            );
                            const i1n = faceVertexIndex-1;
                            const i2n = faceVertexIndex;
                            faceVertexIndex++;
                            normalsProcessed.push(
                                ...Utils.getVertex3ByIndexAndMappingType(i0,face[0],normalMappingType,normals),
                                ...Utils.getVertex3ByIndexAndMappingType(i1n,face[j],normalMappingType,normals),
                                ...Utils.getVertex3ByIndexAndMappingType(i2n,face[j+1],normalMappingType,normals),
                            )
                            if (useTexture) {
                                uvsProcessed.push(
                                    ...Utils.getVertex2ByIndexAndMappingType(i0,face[0],uvMappingType,uvs,uvIndices),
                                    ...Utils.getVertex2ByIndexAndMappingType(i1n,face[j],uvMappingType,uvs,uvIndices),
                                    ...Utils.getVertex2ByIndexAndMappingType(i2n,face[j+1],uvMappingType,uvs,uvIndices),
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
        Utils.findNodes(this.reader.rootNode,'Objects').forEach(o=>{
            Utils.findNodes(o,'Model').forEach(m=>{
                const uuid = m.props[0] as number;
                const name = (m.props[1] as string || '').replace('Model::','');
                const modelContainer = new FbxModelContainer(this.game);
                res.push(modelContainer);

                modelContainer.uuid = uuid;
                modelContainer.tag = name;
                const properties70 = Utils.findNode(m,'Properties70');
                const translation = Utils.findProperty70(properties70,'Lcl Translation');
                if (translation) {
                    const x = (translation[4+2] as number);
                    const y = -(translation[4+0] as number);
                    const z = (translation[4+1] as number);
                    modelContainer.pos.setXYZ(x,y,z);
                }
                const rotation = Utils.findProperty70(properties70,'Lcl Rotation');
                if (rotation) {
                    modelContainer.angle3d.setXYZ(
                        -MathEx.degToRad(rotation[4+2] as number),
                        MathEx.degToRad(rotation[4+0] as number),
                        MathEx.degToRad(rotation[4+1] as number)
                    );
                }
                const scale = Utils.findProperty70(properties70,'Lcl Scaling');
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
        Utils.findNodes(this.reader.rootNode,'Material').forEach(m=>{
            const uuid = m.props[0] as number;
            const name = ((m.props[1] || '') as string).replace('Material::','');
            const material = new FbxMaterial();
            material.tag = name;
            material.uuid = uuid;
            const properties70 = Utils.findNode(m,'Properties70');
            const diffuseColor = Utils.findProperty70(properties70,'DiffuseColor');
            const specular = Utils.findProperty70(properties70,'Shininess');
            const transparencyFactor = Utils.findProperty70(properties70,'TransparencyFactor') ?? [];
            let specularValue = 0;
            if (specular && specular[4]) {
                specularValue = specular[4]/100;
                specularValue = Math.min(specularValue,1);
            }
            if (diffuseColor) {
                material.diffuseColor.setRGB(
                    ~~(diffuseColor[4]*0xff) as Uint8,
                    ~~(diffuseColor[5]*0xff) as Uint8,
                    ~~(diffuseColor[6]*0xff) as Uint8
                );
            }
            material.transparencyFactor = transparencyFactor[4] ?? 1;
            material.specular = specularValue;
            result.push(material);
        });
        return result;
    }

    private _parseTextures():FbxTexture[] {
        const textures:FbxTexture[] = [];
        Utils.findNodes(this.reader.rootNode,'Texture').forEach(t=>{
            const texture = new FbxTexture();
            texture.uuid = t.props[0] as number;
            const fileNameNode = Utils.findNode(t,'FileName');
            const fileName:string =
                (fileNameNode?.props?.[0] as string) ??
                ((t.props[1] || '') as string).replace('Texture::','');
            texture.tag = Utils.extractNameWithoutExtension(Utils.extractFileNameFromPath(fileName));
            textures.push(texture);
        });
        return textures;
    }

    private _parseVideos():FbxVideo[] {
        const videos:FbxVideo[] = [];
        Utils.findNodes(this.reader.rootNode,'Video').forEach(t=>{
            const video = new FbxVideo();
            video.uuid = t.props[0] as number;
            const fileNameNode = Utils.findNode(t,'FileName');
            const contentNode = Utils.findNode(t,'Content');
            video.embeddedData = contentNode?.props?.[0] as number[];
            const fileName:string =
                (fileNameNode?.props?.[0] as string) ??
                ((t.props[1] || '') as string).replace('Video::','');
            video.tag = Utils.extractNameWithoutExtension(Utils.extractFileNameFromPath(fileName));
            videos.push(video);
        });
        return videos;
    }

    private _parseConnections():[number,number][] {
        const result:[number,number][] = [];
        const connections = Utils.findNode(this.reader.rootNode,'Connections');
        if (!connections) return result;
        connections.nodes.forEach((c:any)=>{
            const cn:[number,number] = [
                c.props[1] as  number,
                c.props[2] as number
            ];
            result.push(cn);
        });
        return result;
    }

    private async _applyTexture(g:FbxModel3d,textureToApply:FbxTexture,videos:FbxVideo[],txDesc:ITextureDescription) {
        let texture = txDesc.texture;

        if (texture===undefined && txDesc.useEmbedded) {
            const embeddedData = videos.find(it=>it.tag===textureToApply.tag)?.embeddedData as number[];
            if (!embeddedData) return;
            texture = await Utils.createTextureFromData(this.game.getRenderer(),embeddedData);
            if (!texture) return;
        }

        if (txDesc.type===undefined || txDesc.type=='color') {
            g.texture = texture;
        } else if (txDesc.type==='normals') {
            g.normalsTexture = texture;
        } else if (txDesc.type==='specular') {
            g.specularTexture = texture;
        } else {
            throw new Error(`unknown texture type: ${txDesc.type}`);
        }
    }

    private async _applyMaterialsToGeometries(geometries:FbxModel3d[],materials:FbxMaterial[],textures:FbxTexture[],videos:FbxVideo[],connections:[number,number][]) {
        const materialIds = materials.map(it=>it.uuid);
        for (const g of geometries) {
            const connectionPair = connections.find(c => c[0] === g.uuid);
            if (!connectionPair) continue;
            const materialId = (connections.filter(c=>c[1]===connectionPair[1]).filter(c=>materialIds.includes(c[0])))[0]?.[0];
            if (!materialId) continue;
            const material = materials.find(g => g.uuid === materialId);
            if (!material) continue;
            g.material = material.clone();
            g.alpha = material.transparencyFactor;
            const texturesToApply = this._findTexturesByMaterialId(materialId,textures,connections);

            for (const textureToApply of texturesToApply) {
                const txDescOrArr:Optional<ITextureDescription|ITextureDescription[]> = this.params?.textures?.[textureToApply.tag];
                if (!txDescOrArr) continue;

                if ((txDescOrArr as ITextureDescription[]).indexOf!==undefined) {
                    for (const txDesc of (txDescOrArr as ITextureDescription[])) {
                        await this._applyTexture(g,textureToApply,videos,txDesc);
                    }
                } else {
                    const txDesc = txDescOrArr as ITextureDescription;
                    await this._applyTexture(g,textureToApply,videos,txDesc);
                }
            }
        }
    }

    private _findTexturesByMaterialId(materialId:number,textures:FbxTexture[],connections:[number,number][]):FbxTexture[] {
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
                this.container.meshes.push(geometry);
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

    public async parse() {
        console.log(this.reader.rootNode);
        this._parseGlobalSettings();

        const geometries = this._parseGeometries();
        const models = this._parseModels();
        const materials = this._parseMaterials();
        const textures = this._parseTextures();
        const videos = this._parseVideos();
        const connections = this._parseConnections();
        await this._applyMaterialsToGeometries(geometries,materials,textures,videos,connections);
        this._applyGeometriesToModels(geometries,models,connections);
        this._buildModelGraph(models,connections);
        this.completed = true;
    }

    public async getModel():Promise<FbxModelWrapper> {
        if (!this.completed) await this.parse();
        return this.containerTransformWrap;
    }

}

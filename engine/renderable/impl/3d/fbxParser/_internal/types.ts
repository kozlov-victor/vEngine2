import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";

export type FBXData = FBXNode[]

export interface FBXNode {
    name: string
    props: FBXProperty[]
    nodes: FBXNode[]
}

export type FBXProperty = boolean | number | BigInt | boolean[] | number[] | BigInt[] | string


export interface ITextureDescription {
    texture?:ITexture,
    type?: 'color'|'normals',
    useEmbedded?:boolean,
}

export interface IFbxParams {
    textures?:Record<string, ITextureDescription>;
    cubeMapTexture?:ICubeMapTexture;
}

export type ReferenceType = 'Direct'|'IndexToDirect';
export type MappingType = 'ByPolygon'|'ByPolygonVertex'|'ByVertex'|'ByVertice'|'ByEdge'|'AllSame';


export interface IFbxNode {
    tag: string;
    uuid:number;
}

import {ISize} from "../../geometry/size";

export interface ITexture {
    size: Readonly<ISize>;
}

export interface ICubeMapTexture extends ITexture {
    type: 'cubeMapTexture';
}

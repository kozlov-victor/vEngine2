import {Size} from "../../geometry/size";

export interface ITexture {
    size: Size;
}

export interface ICubeMapTexture extends ITexture {
    type: 'cubeMapTexture';
}

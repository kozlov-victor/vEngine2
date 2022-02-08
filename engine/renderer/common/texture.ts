import {ISize} from "../../geometry/size";
import {IDestroyable} from "@engine/core/declarations";

export interface ITexture extends IDestroyable {
    size: Readonly<ISize>;
}

export interface ICubeMapTexture extends ITexture {
    type: 'cubeMapTexture';
}

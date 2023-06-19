import {ISize} from "../../geometry/size";
import {IDestroyable} from "@engine/core/declarations";

export interface ITexture extends IDestroyable {
    size: Readonly<ISize>;
    __kind__: 'Texture';
}

export interface ICubeMapTexture extends IDestroyable {
    size: Readonly<ISize>;
    __kind__: 'CubeMapTexture';
}

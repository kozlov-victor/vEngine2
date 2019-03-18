import {TextureInfo} from "../abstract/abstractDrawer";

export interface IDrawer {

    draw(textureInfos:TextureInfo[]):void;

}
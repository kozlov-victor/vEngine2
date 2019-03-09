
import {FrameBuffer} from "../../base/frameBuffer";
import {TextureInfo} from "../abstract/abstractDrawer";
import {UniformsInfo} from "./uniformsInfo";

export interface IDrawer {

    draw(textureInfos:TextureInfo[],uniforms:UniformsInfo,frameBuffer:FrameBuffer):void;

}
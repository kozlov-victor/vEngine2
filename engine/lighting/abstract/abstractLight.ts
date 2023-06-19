import {Color} from "../../renderer/common/color";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {FastMap} from "@engine/misc/collection/fastMap";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";


export abstract class AbstractLight extends RenderableModel {

    public color:Color = Color.WHITE.clone();
    public intensity:number = 1.0;

    public abstract setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>, i:number):void;

}

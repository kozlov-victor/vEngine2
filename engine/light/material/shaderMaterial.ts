import {Color} from "../../renderer/common/color";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FastMap} from "@engine/misc/collection/fastMap";

export class ShaderMaterial {

    public static readonly DEFAULT = new ShaderMaterial();

    public ambient:Color = Color.WHITE.clone();
    public specular:Color = Color.GREY.clone();
    public diffuse:Color = Color.WHITE.clone();
    public shininess:number = 10;

    constructor(){}

    public setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>):void{
        map.put('u_material.ambient',this.ambient.asGL());
        map.put('u_material.specular',this.specular.asGL());
        map.put('u_material.diffuse',this.diffuse.asGL());
        map.put('u_material.shininess',this.shininess);
    }

}
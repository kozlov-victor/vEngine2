import {Color} from "../../renderer/color";
import {IKeyVal} from "../../misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class ShaderMaterial {

    public static readonly DEFAULT = new ShaderMaterial();

    public readonly ambient:Color = Color.WHITE.clone();
    public readonly specular:Color = Color.GREY.clone();
    public readonly diffuse:Color = Color.WHITE.clone();
    readonly shininess:number = 10;

    constructor(){}

    setUniformsToMap(map:IKeyVal<UNIFORM_VALUE_TYPE>):void{
        map['u_material.ambient'] = this.ambient.asGL();
        map['u_material.specular'] = this.specular.asGL();
        map['u_material.diffuse'] = this.diffuse.asGL();
        map['u_material.shininess'] = this.shininess;
    }

}
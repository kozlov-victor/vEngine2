import {Color} from "../../renderer/color";
import {IKeyVal} from "../../misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class ShaderMaterial {

    public static readonly DEFAULT = new ShaderMaterial();

    public ambient:Color = Color.WHITE.clone();
    public specular:Color = Color.GREY.clone();
    public diffuse:Color = Color.WHITE.clone();
    public shininess:number = 10;

    constructor(){}

    /** @internal */
    setUniformsToMap(map:IKeyVal<UNIFORM_VALUE_TYPE>):void{
        map['u_material.ambient'] = this.ambient.asGL();
        map['u_material.specular'] = this.specular.asGL();
        map['u_material.diffuse'] = this.diffuse.asGL();
        map['u_material.shininess'] = this.shininess;
    }

}
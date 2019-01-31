
import {Color} from "../renderer/color";
import {IKeyVal} from "../misc/object";

export class ShaderMaterial {

    public static readonly DEFAULT = new ShaderMaterial();

    public readonly ambient:Color = Color.BLACK.clone();
    public readonly specular:Color = Color.GREY.clone();
    public readonly diffuse:Color = Color.WHITE.clone();
    public readonly shininess:number = 10;

    constructor(){}

    setUniforms(uniforms:IKeyVal){
        uniforms['u_material.ambient'] = this.ambient.asGL();
        uniforms['u_material.specular'] = this.specular.asGL();
        uniforms['u_material.diffuse'] = this.diffuse.asGL();
        uniforms['u_material.shininess'] = this.shininess;
    }

}
import {PointLight} from "@engine/light/impl/pointLight";
import {IKeyVal} from "@engine/misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class DirectionalLight extends PointLight {

    public static readonly LIGHT_TYPE:number = 1;

    direction:[number,number,number] = [-1,0,0];

    /** @private */
    setUniformsToMap(map:IKeyVal<UNIFORM_VALUE_TYPE>, i:number):void{
        super.setUniformsToMap(map,i);
        map[`u_pointLights[${i}].type`] = DirectionalLight.LIGHT_TYPE;
        map[`u_pointLights[${i}].direction`] = this.direction;
    }

}
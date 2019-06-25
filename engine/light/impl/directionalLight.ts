import {PointLight} from "@engine/light/impl/pointLight";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FastMap} from "@engine/misc/fastMap";

export class DirectionalLight extends PointLight {

    public static readonly LIGHT_TYPE:number = 1;

    public direction:[number,number,number] = [-1,0,0];

    /** @private */
    public setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>, i:number):void{
        super.setUniformsToMap(map,i);
        map.put(`u_pointLights[${i}].type`,DirectionalLight.LIGHT_TYPE);
        map.put(`u_pointLights[${i}].direction`,this.direction);
    }

}
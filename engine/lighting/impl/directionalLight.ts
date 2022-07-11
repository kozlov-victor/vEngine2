import {PointLight} from "@engine/lighting/impl/pointLight";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FastMap} from "@engine/misc/collection/fastMap";

export class DirectionalLight extends PointLight {

    public static override readonly LIGHT_TYPE:number = 1;

    public direction:Float32Array = new Float32Array([-1,0,0]);

    public override setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>, i:number):void{
        super.setUniformsToMap(map,i);
        map.put(`u_pointLights[${i}].type`,DirectionalLight.LIGHT_TYPE);
        map.put(`u_pointLights[${i}].direction`,this.direction);
    }


}

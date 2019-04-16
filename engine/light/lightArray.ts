import {DebugError} from "../debug/debugError";
import {Game} from "../game";
import {IKeyVal} from "../misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {AbstractLight} from "@engine/light/abstract/abstractLight";
import {PointLight} from "@engine/light/pointLight";
import {AmbientLight} from "@engine/light/ambientLight";
import {ShaderMaterial} from "@engine/light/shaderMaterial";

export class LightArray {

    static NUM_OF_LIGHT_IN_VIEW:number = 1;

    readonly ambientLight:AmbientLight = new AmbientLight(this.game);
    readonly material:ShaderMaterial = new ShaderMaterial();
    private readonly pointLights:PointLight[] = [];

    constructor(private game:Game){
        this.ambientLight.color.setRGB(50,50,50);
        if (DEBUG && !game) throw new DebugError(`game instance is not passed to LightArray constructor`);
    }

    getLightAt(i:number):PointLight{
        return this.pointLights[i];
    }

    addPointLight(l:PointLight):void{
        this.pointLights.push(l);
    }

    setUniformsToBatch(uniforms:IKeyVal<UNIFORM_VALUE_TYPE>):void{
        this.ambientLight.setUniforms(uniforms); // todo rename to batch
        this.material.setUniforms(uniforms);
        for (let i:number=0;i<this.pointLights.length;i++){
            let p:AbstractLight = this.pointLights[i];
            p.setUniforms(uniforms,i);
        }
    }

}
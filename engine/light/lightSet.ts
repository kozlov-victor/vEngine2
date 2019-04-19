import {DebugError} from "../debug/debugError";
import {Game} from "../game";
import {IKeyVal} from "../misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {AbstractLight} from "@engine/light/abstract/abstractLight";
import {PointLight} from "@engine/light/impl/pointLight";
import {AmbientLight} from "@engine/light/impl/ambientLight";
import {ShaderMaterial} from "@engine/light/material/shaderMaterial";

export class LightSet {

    static MAX_NUM_OF_POINT_LIGHTS:number = 16;

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
        if (DEBUG && this.pointLights.length==LightSet.MAX_NUM_OF_POINT_LIGHTS)
            throw new DebugError(`can not add point light: maximum size of lights is ${LightSet.MAX_NUM_OF_POINT_LIGHTS}`);
        this.pointLights.push(l);
    }

    setUniformsToMap(map:IKeyVal<UNIFORM_VALUE_TYPE>):void{
        map['u_numOfPointLights'] = this.pointLights.length;
        this.ambientLight.setUniformsToMap(map);
        this.material.setUniformsToMap(map);
        for (let i:number=0;i<this.pointLights.length;i++){
            let p:AbstractLight = this.pointLights[i];
            p.setUniformsToMap(map,i);
        }
    }

}
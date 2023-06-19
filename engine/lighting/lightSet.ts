import {DebugError} from "../debug/debugError";
import {Game} from "../core/game";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {AbstractLight} from "@engine/lighting/abstract/abstractLight";
import {PointLight} from "@engine/lighting/impl/pointLight";
import {AmbientLight} from "@engine/lighting/impl/ambientLight";
import {FastMap} from "@engine/misc/collection/fastMap";

export class LightSet {

    public readonly ambientLight:AmbientLight = new AmbientLight(this.game);

    constructor(private game:Game,private readonly pointLights:PointLight[]){
        this.ambientLight.color.setRGB(50,50,50);
        if (DEBUG && !game) throw new DebugError(`game instance is not passed to LightArray constructor`);
    }

    public getLightAt(i:number):PointLight{
        return this.pointLights[i];
    }

    public getSize():number {
        return this.pointLights.length;
    }

    public setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>):void{
        this.ambientLight.setUniformsToMap(map);
        for (let i:number=0;i<this.pointLights.length;i++) {
            const p:AbstractLight = this.pointLights[i];
            p.setUniformsToMap(map,i);
        }
    }

}

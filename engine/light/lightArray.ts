import {DebugError} from "../debug/debugError";


import {PointLight} from "./pointLight";
import {Game} from "../game";
import {IKeyVal} from "../misc/object";
import {Int} from "@engine/declarations";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class LightArray {

    static NUM_OF_LIGHT_IN_VIEW:number = 4;

    private readonly lights:PointLight[];

    constructor(game:Game){
        if (DEBUG && !game) throw new DebugError(`game instance is not passed to LightArray constructor`);
        this.lights = new Array(LightArray.NUM_OF_LIGHT_IN_VIEW);
        for (let i:number=0;i<this.lights.length;i++){
            this.lights[i] = new PointLight(game);
        }
    }

    getLightAt(i:number):PointLight{
        return this.lights[i];
    }

    setUniforms(uniform:IKeyVal<UNIFORM_VALUE_TYPE>):void{
        for (let i:number=0;i<this.lights.length;i++){
            let p:PointLight = this.lights[i];
            p.setUniforms(uniform,i);
        }
    }

}
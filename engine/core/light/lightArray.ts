import {DebugError} from "../../debugError";



import {PointLight} from "./pointLight";
import {Game} from "../game";
import {IKeyVal} from "../misc/object";

export class LightArray {

    static NUM_OF_LIGHT_IN_VIEW = 4;

    private readonly lights:Array<PointLight>;

    constructor(game:Game){
        if (DEBUG && !game) throw new DebugError(`game instance is not passed to LightArray constructor`);
        this.lights = new Array(LightArray.NUM_OF_LIGHT_IN_VIEW);
        for (let i=0;i<this.lights.length;i++){
            this.lights[i] = new PointLight(game);
        }
    }

    getLightAt(i:number):PointLight{
        return this.lights[i];
    }

    setUniforms(uniform:IKeyVal){
        for (let i=0;i<this.lights.length;i++){
            let p:PointLight = this.lights[i];
            p.setUniforms(uniform,i);
        }
    }

}
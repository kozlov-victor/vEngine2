import {AbstractLight} from "../abstract/abstractLight";
import {Game} from "../../core/game";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FastMap} from "@engine/misc/collection/fastMap";


export class AmbientLight extends AbstractLight{

    public direction:Float32Array = new Float32Array([0,0,-1]);

    constructor(protected game: Game) {
        super(game);
    }

    public setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>):void {
        map.put('u_ambientLight.color',this.color.asGL());
        map.put('u_ambientLight.direction',this.direction);
        map.put('u_ambientLight.intensity',this.intensity);
    }

}

import {AbstractLight} from "../abstract/abstractLight";
import {Game} from "../../game";
import {IKeyVal} from "../../misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FastMap} from "@engine/misc/fastMap";

export class AmbientLight extends AbstractLight{

    public direction:[number,number,number];


    constructor(protected game: Game) {
        super(game);
        this.direction = [1,1,1];
    }

    /** @private */
    public setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>):void {
        map.put('u_ambientLight.color',this.color.asGL());
        map.put('u_ambientLight.direction',this.direction);
        map.put('u_ambientLight.intensity',this.intensity);
    }

}
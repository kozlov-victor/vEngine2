import {AbstractLight} from "../abstract/abstractLight";
import {Game} from "../../core/game";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {FastMap} from "@engine/misc/collection/fastMap";


export class AmbientLight extends AbstractLight {

    constructor(game: Game) {
        super(game);
    }

    public setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>):void {
        map.put('u_ambientLight.color',this.color.asGL());
        map.put('u_ambientLight.intensity',this.intensity);
    }

    public draw(): void {}



}

import {AbstractLight} from "./abstract/abstractLight";
import {Game} from "../game";
import {IKeyVal} from "../misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class AmbientLight extends AbstractLight{

    direction:number[]; // todo vector?

    constructor(game: Game) {
        super(game);
        this.direction = [1,1,1];
    }

    setUniforms(uniform:IKeyVal<UNIFORM_VALUE_TYPE>):void {
        uniform['u_ambientLight.color'] = this.color.asGL();
        uniform['u_ambientLight.direction'] = this.direction;
    }

}
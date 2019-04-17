import {AbstractLight} from "../abstract/abstractLight";
import {Game} from "../../game";
import {IKeyVal} from "../../misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class AmbientLight extends AbstractLight{

    direction:[number,number,number];


    constructor(protected game: Game) {
        super(game);
        this.direction = [1,1,1];
    }

    setUniformsToMap(map:IKeyVal<UNIFORM_VALUE_TYPE>):void {
        map['u_ambientLight.color'] = this.color.asGL();
        map['u_ambientLight.direction'] = this.direction;
        map['u_ambientLight.intensity'] = this.intensity;
    }

}
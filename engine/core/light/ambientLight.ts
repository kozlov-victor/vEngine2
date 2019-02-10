
import {AbstractLight} from "./abstract/abstractLight";
import {Game} from "../game";
import {IKeyVal} from "../misc/object";

export class AmbientLight extends AbstractLight{

    direction:number[]; // todo vector?

    constructor(game: Game) {
        super(game);
        this.direction = [1,1,1];
    }

    setUniforms(uniform:IKeyVal){
        uniform['u_ambientLight.color'] = this.color.asGL();
        uniform['u_ambientLight.direction'] = this.direction;
    }

}
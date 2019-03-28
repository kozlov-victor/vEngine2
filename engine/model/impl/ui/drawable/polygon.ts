import {Color} from "@engine/renderer/color";
import {Game} from "@engine/game";


type float = number;

export class Polygon {

    readonly type:string = 'Polygon';
    fillColor: Color = Color.NONE;
    private vertices:float[] = [];

    constructor(private game:Game){}

    setVertices(vertices:float[]){
        this.vertices = vertices;
    }

}
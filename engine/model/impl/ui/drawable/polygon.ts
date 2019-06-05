import {Color} from "@engine/renderer/color";
import {Game} from "@engine/game";


type float = number;

export class Polygon {

    public readonly type:string = 'Polygon';
    public fillColor: Color = Color.NONE;
    private vertices:float[] = [];

    constructor(private game:Game){}

    public setVertices(vertices:float[]):void {
        this.vertices = vertices;
    }

}
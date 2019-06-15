import {Color} from "@engine/renderer/color";
import {Game} from "@engine/game";
import {Mesh} from "@engine/model/abstract/mesh";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Cube} from "@engine/renderer/webGl/primitives/cube";

class PolygonPrimitive extends AbstractPrimitive {
    constructor(){
        super();
        this.vertexArr = [];
    }
}

export class Polygon extends Mesh {

    public readonly type:string = 'Polygon';
    public readonly vertexItemSize:2|3 = 2;

    constructor(protected game:Game){
        super(game,false,false);
    }

    public setVertices(vertices:number[]):void {
        this.modelPrimitive = new PolygonPrimitive();
        this.modelPrimitive.vertexArr = vertices;
    }

}
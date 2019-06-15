import {BufferInfo} from "../../renderer/webGl/base/bufferInfo";
import {IPrimitive} from "../../renderer/webGl/primitives/abstractPrimitive";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {RenderableModel} from "@engine/model/abstract/renderableModel";
import {Game} from "@engine/game";
import {Color} from "@engine/renderer/color";


export abstract class Mesh extends RenderableModel {

    public modelPrimitive:IPrimitive;
    public texture:Texture;
    public fillColor:Color = Color.WHITE.clone();
    public bufferInfo:BufferInfo;
    public vertexItemSize:2|3 = 3;

    constructor(
        protected game:Game,
        public readonly depthTest:boolean,
        public readonly invertY:boolean
    ) {
        super(game);
    }

    public draw():boolean{
        this.game.getRenderer().drawMesh(this);
        return true;
    }

}
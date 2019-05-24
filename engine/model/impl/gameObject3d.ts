import {GameObject} from "./gameObject";
import {BufferInfo} from "../../renderer/webGl/base/bufferInfo";
import {IPrimitive} from "../../renderer/webGl/primitives/abstractPrimitive";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {RenderableModel} from "@engine/model/renderableModel";
import {Game} from "@engine/game";
import {Color} from "@engine/renderer/color";


export class GameObject3d extends RenderableModel {

    model:IPrimitive;
    texture:Texture;
    color:Color = Color.WHITE.clone();
    bufferInfo:BufferInfo;

    constructor(protected game:Game){
        super(game);
    }

    draw():boolean{
        this.game.getRenderer().drawModel(this);
        return true;
    }

}
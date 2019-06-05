import {GameObject} from "./gameObject";
import {BufferInfo} from "../../renderer/webGl/base/bufferInfo";
import {IPrimitive} from "../../renderer/webGl/primitives/abstractPrimitive";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {RenderableModel} from "@engine/model/renderableModel";
import {Game} from "@engine/game";
import {Color} from "@engine/renderer/color";


export class GameObject3d extends RenderableModel {

    public model:IPrimitive;
    public texture:Texture;
    public color:Color = Color.WHITE.clone();
    public bufferInfo:BufferInfo;

    constructor(protected game:Game){
        super(game);
    }

    public draw():boolean{
        this.game.getRenderer().drawModel(this);
        return true;
    }

}
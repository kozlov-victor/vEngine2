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
    angleY:number = 0;

    constructor(protected game:Game){
        super(game);
    }

    protected isNeedAdditionalTransform():boolean{
        return !(this.angle===0 && this.angleY===0 && this.scale.equal(1));
    }

    protected doAdditionalTransform():void {
        this.game.getRenderer().rotateY(this.angleY);
    }

    draw():boolean{
        this.game.getRenderer().drawModel(this);
        return true;
    }

}
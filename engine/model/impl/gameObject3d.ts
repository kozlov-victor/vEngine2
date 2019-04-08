import {GameObject} from "./gameObject";
import {BufferInfo} from "../../renderer/webGl/base/bufferInfo";
import {IPrimitive} from "../../renderer/webGl/primitives/abstractPrimitive";
import {Texture} from "@engine/renderer/webGl/base/texture";


export class GameObject3d extends GameObject {

    model:IPrimitive;
    texture:Texture;
    bufferInfo:BufferInfo;
    angleY:number = 0;

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
import { GameObject } from './gameObject';
import {BufferInfo} from "../../core/renderer/webGl/base/bufferInfo";
import {IPrimitive} from "../../core/renderer/webGl/primitives/abstractPrimitive";


export class GameObject3d extends GameObject {

    model:IPrimitive;
    texture;
    bufferInfo:BufferInfo;
    angleY:number = 0;

    protected isNeedAdditionalTransform():boolean{
        return !(this.angle===0 && this.angleY===0 && this.scale.equal(1));
    }

    protected doAdditionalTransform(){
        this.game.getRenderer().rotateY(this.angleY);
    }

    draw():boolean{
        this.game.getRenderer().drawModel(this);
        return true;
    }

}
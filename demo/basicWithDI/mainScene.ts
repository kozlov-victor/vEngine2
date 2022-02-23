import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {LogoResources} from "./logoResources";
import {Resource} from "@engine/resources/resourceDecorators";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class MainScene extends Scene {

    @Resource.ResourceHolder() private logoRes:LogoResources;

    public override onReady():void {

        const spr:Image = new Image(this.game,this.logoRes.logoTexture);
        spr.pos.fromJSON({x:10,y:10});
        spr.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(spr);
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    spr.pos.addX(-1);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    spr.pos.addX(1);
                    break;
                case KEYBOARD_KEY.UP:
                    spr.pos.addY(-1);
                    break;
                case KEYBOARD_KEY.DOWN:
                    spr.pos.addY(1);
                    break;
                case KEYBOARD_KEY.R:
                    spr.angle+=0.1;
            }
        });
        this.gamepadEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            console.log(e);
        });
    }

}

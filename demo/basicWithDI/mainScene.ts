import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {GAME_PAD_EVENTS} from "@engine/control/gamepad/gamePadEvents";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {LogoResources} from "./logoResources";

export class MainScene extends Scene {

    private logoRes:LogoResources = new LogoResources(this);

    public onReady() {

        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoRes.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        spr.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(spr);
        this.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.key) {
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
        this.on(GAME_PAD_EVENTS.buttonPressed, e=>{
            console.log(e);
        });
    }

}

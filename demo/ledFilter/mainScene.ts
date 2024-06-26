import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Resource} from "@engine/resources/resourceDecorators";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {LedFilter} from "@engine/renderer/webGl/filters/texture/ledFilter";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    public readonly logoTexture:ITexture;

    public override onReady():void {
        const spr = new Image(this.game, this.logoTexture);
        spr.pos.setXY(10);
        spr.transformPoint.setToCenter();
        spr.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(spr);
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e: IKeyBoardEvent) => {
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
                    spr.angle += 0.1;
            }
        });
        spr.filters = [new LedFilter(this.game)];
    }
}

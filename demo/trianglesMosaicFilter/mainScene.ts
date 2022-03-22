import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {TrianglesMosaicFilter} from "@engine/renderer/webGl/filters/texture/trianglesMosaicFilter";
import {VignetteFilter} from "@engine/renderer/webGl/filters/texture/vignetteFilter";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {Resource} from "@engine/resources/resourceDecorators";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoLink:ITexture;

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
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
        const tm = new TrianglesMosaicFilter(this.game);
        const v = new VignetteFilter(this.game);
        this.filters = [v,tm];

    }

}

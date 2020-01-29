import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {GAME_PAD_EVENTS, GamePadEvent} from "@engine/control/gamepad/gamePadEvents";
import {Layer, LayerTransformType} from "@engine/scene/layer";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;
    private bgLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.size.setWH(1100,2100);
        this.logoLink = this.resourceLoader.loadTexture("./assets/logo.png");
        this.bgLink = this.resourceLoader.loadTexture("./assets/repeat.jpg");
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {

        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.size.setWH(250,300);
        spr.stretchMode = STRETCH_MODE.REPEAT;
        spr.offset.setXY(1,1);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        const bg:Image = new Image(this.game);
        bg.setResourceLink(this.bgLink);
        bg.size.setWH(1000,2000);
        bg.stretchMode = STRETCH_MODE.STRETCH;
        this.appendChild(bg);
        spr.moveToFront();
        spr.addBehaviour(new DraggableBehaviour(this.game));

        this.game.camera.followTo(spr);

        const uiLayer:Layer = new Layer(this.game);
        uiLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        const infoRect:Rectangle = new Rectangle(this.game);
        infoRect.size.setWH(600,50);
        infoRect.color.setRGB(200,12,22);
        (infoRect.fillColor as Color).setRGB(12,100,55);
        infoRect.addBehaviour(new DraggableBehaviour(this.game));
        uiLayer.appendChild(infoRect);
        this.addLayer(uiLayer);

        this.on(KEYBOARD_EVENTS.keyHold, (e:KeyBoardEvent)=>{
            switch (e.key) {
                case KEYBOARD_KEY.LEFT:
                    spr.pos.addX(-5);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    spr.pos.addX(5);
                    break;
                case KEYBOARD_KEY.UP:
                    spr.pos.addY(-5);
                    break;
                case KEYBOARD_KEY.DOWN:
                    spr.pos.addY(5);
                    break;
                case KEYBOARD_KEY.R:
                    spr.angle+=0.1;
            }
        });


        this.on(GAME_PAD_EVENTS.buttonHold, (e:GamePadEvent)=>{
            switch (e.button) {
                case GAME_PAD_BUTTON.STICK_L_LEFT:
                    spr.pos.addX(-1);
                    break;
                case GAME_PAD_BUTTON.STICK_L_RIGHT:
                    spr.pos.addX(1);
                    break;
                case GAME_PAD_BUTTON.STICK_L_UP:
                    spr.pos.addY(-1);
                    break;
                case GAME_PAD_BUTTON.STICK_L_DOWN:
                    spr.pos.addY(1);
                    break;
                case GAME_PAD_BUTTON.BTN_A:
                    spr.angle+=0.1;
                    break;
                case GAME_PAD_BUTTON.BTN_B:
                    spr.angle-=0.1;
                    break;
            }
        });


    }

}

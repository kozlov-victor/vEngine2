import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image/image";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Layer, LayerTransformType} from "@engine/scene/layer";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {IGamePadEvent} from "@engine/control/gamepad/iGamePadEvent";
import {ResourceHolder} from "./resources/resourceHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";

export class MainScene extends Scene {

    @Resource.ResourceHolder() public readonly resourceHolder:ResourceHolder;

    public override onReady():void {

        this.size.setWH(1100,2100);

        const spr:Image = new Image(this.game,this.resourceHolder.logoTexture);
        spr.size.setWH(250,300);
        spr.stretchMode = STRETCH_MODE.REPEAT;
        spr.offset.setXY(1,1);
        spr.pos.setFrom({x:10,y:10});
        this.appendChild(spr);

        const bg:Image = new Image(this.game,this.resourceHolder.bgTexture);
        bg.size.setWH(1000,2000);
        bg.stretchMode = STRETCH_MODE.STRETCH;
        this.appendChild(bg);
        spr.moveToFront();
        spr.addBehaviour(new DraggableBehaviour(this.game));

        this.camera.followTo(spr);

        const uiLayer:Layer = new Layer(this.game);
        uiLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        const infoRect:Rectangle = new Rectangle(this.game);
        infoRect.size.setWH(600,50);
        infoRect.color.setRGB(200,12,22);
        infoRect.fillColor.setRGB(12,100,55);
        infoRect.addBehaviour(new DraggableBehaviour(this.game));
        uiLayer.appendChild(infoRect);
        this.appendChild(uiLayer);

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.button) {
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


        this.gamepadEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IGamePadEvent)=>{
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

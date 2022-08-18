import {Scene} from "@engine/scene/scene";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {Resource} from "@engine/resources/resourceDecorators";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {IGamePadEvent} from "@engine/control/gamepad/iGamePadEvent";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png') private logoTexture:ITexture;
    @Resource.Texture('./assets/repeat.jpg')  private bgTexture:ITexture;

    public override onReady():void {

        this.camera.angle = 0.1;
        this.camera.pos.z = 10;

        this.size.setWH(1100,2100);
        this.camera.scale.setXY(0.7, 0.9);

        const spr:Image = new Image(this.game,this.logoTexture);
        spr.size.setWH(250,300);
        spr.stretchMode = STRETCH_MODE.REPEAT;
        spr.offset.setXY(1,1);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        const bg:Image = new Image(this.game,this.bgTexture);
        bg.size.setWH(1000,2000);
        bg.stretchMode = STRETCH_MODE.STRETCH;
        this.appendChild(bg);
        spr.moveToFront();
        spr.addBehaviour(new DraggableBehaviour(this.game));

        this.camera.followTo(spr);


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

        this.mouseEventHandler.on(MOUSE_EVENTS.click, e=>{
            const rect = new Rectangle(this.game);
            rect.fillColor = Color.RGB(122,12,33);
            rect.pos.setXYZ(e.sceneX,e.sceneY,-this.camera.pos.z);
            this.getLayers()[0].appendChild(rect);
            console.log(e);
        });


    }

}

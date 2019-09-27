import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MainScene as Scene2} from '../polylines3/mainScene';
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {PushTransition} from "@engine/scene/transition/pushTransition";
import {SIDE} from "@engine/scene/transition/side";
import {Color} from "@engine/renderer/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderer/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Easing} from "@engine/misc/easing/quad";


export class MainScene extends Scene {

    public onReady() {
        this.colorBG = Color.RGB(222);

        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0.2;
        gradient.colorFrom = Color.RGB(100,0,20);
        gradient.colorTo = Color.RGB(200,111,1);
        rect.fillColor = gradient;
        rect.borderRadius = 5;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(40);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect);


        this.on(MOUSE_EVENTS.click, e=>{
            const transition:ISceneTransition = new PushTransition(this.game,SIDE.TOP,1000,Easing.Quad.InOut);
            this.game.runScene(new Scene2(this.game),transition);
        });
    }

}

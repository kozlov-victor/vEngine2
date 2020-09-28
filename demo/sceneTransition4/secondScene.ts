import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";

export class SecondScene extends Scene {

    private fnt:Font;

    public onPreloading(){

        this.colorBG = Color.RGB(222,244,244);

        this.fnt = new Font(this.game, {fontSize: 25});

        const rect = new Rectangle(this.game);
        rect.borderRadius = 5;
        rect.fillColor.setRGB(10,100,100);
        rect.pos.y = 50;
        rect.size.height = 20;
        this.preloadingGameObject = rect;

    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {

        console.log('scene 2 on ready');

        const tf:TextField = new TextField(this.game,this.fnt);
        tf.pos.setXY(10,40);
        tf.textColor.setRGB(10);
        tf.setText("< back");
        tf.setFont(this.fnt);
        tf.on(MOUSE_EVENTS.click, e=>{
            this.game.popScene();
        });
        this.appendChild(tf);

        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0.2;
        gradient.setColorAtPosition(0,Color.RGB(200,0,20));
        gradient.setColorAtPosition(1,Color.RGB(10,111,200));
        rect.fillGradient = gradient;
        rect.borderRadius = 5;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(320,560);
        rect.pos.setXY(100,100);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect);
        rect.transformPoint.setXY(60,30);
        this.setInterval(()=>{
            gradient.angle+=0.01;
        },10);

    }

}

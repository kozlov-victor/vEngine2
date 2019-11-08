import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderer/common/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class SecondScene extends Scene {

    public fnt!:Font;

    public onPreloading(){

        this.colorBG = Color.RGB(241,244,244);

        const fnt:Font = new Font(this.game);
        fnt.fontSize = 25;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(233,12,12);
        fnt.generate();
        this.fnt = fnt;
    }

    public onReady() {

        const tf:TextField = new TextField(this.game);
        tf.pos.setXY(10,40);
        tf.setText("< back");
        tf.setFont(this.fnt);
        tf.on(MOUSE_EVENTS.click, e=>{
            this.game.popScene();
        });
        this.appendChild(tf);

        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0.2;
        gradient.colorFrom = Color.RGB(100,0,20);
        gradient.colorTo = Color.RGB(200,111,1);
        rect.fillColor = gradient;
        rect.borderRadius = 5;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(220,160);
        rect.pos.setXY(100,100);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect);
        rect.rotationPoint.setXY(60,30);

    }

}
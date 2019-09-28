import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/color";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MainScene} from "./mainScene";

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
            this.game.runScene(new MainScene(this.game));
        });
        this.appendChild(tf);

    }

}
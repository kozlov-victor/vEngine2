import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderer/common/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {fakeLongLoadingFn} from "../longLoading/mainScene";
import {VignetteFilter} from "@engine/renderer/webGl/filters/texture/vignetteFilter";
import {ColorizeFilter} from "@engine/renderer/webGl/filters/texture/colorizeFilter";

export class SecondScene extends Scene {

    public fnt!:Font;

    public onPreloading(){

        for (let i:number = 0;i<20;i++) { fakeLongLoadingFn(this.resourceLoader); }

        this.colorBG = Color.RGB(241,244,244);

        const fnt:Font = new Font(this.game);
        fnt.fontSize = 25;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(233,12,12);
        fnt.generate();
        this.fnt = fnt;

        const rect = new Rectangle(this.game);
        rect.borderRadius = 5;
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.pos.y = 50;
        rect.size.height = 20;
        this.preloadingGameObject = rect;

    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
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
        rect.transformPoint.setXY(60,30);

        this.filters = [new VignetteFilter(this.game)];

    }

}
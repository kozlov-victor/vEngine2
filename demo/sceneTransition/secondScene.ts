import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {fakeLongLoadingFn} from "../longLoading/mainScene";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";

export class SecondScene extends Scene {

    private fnt:Font;

    public onPreloading():void{

        for (let i:number = 0;i<20;i++) { fakeLongLoadingFn(this.resourceLoader); }

        this.backgroundColor = Color.RGB(241,244,244);

        this.fnt = new Font(this.game, {fontSize: 25});

        const rect = new Rectangle(this.game);
        rect.borderRadius = 5;
        rect.fillColor.setRGB(10,100,100);
        rect.pos.y = 50;
        rect.size.height = 20;
        this.preloadingGameObject = rect;

    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {

        console.log('scene 2 on ready');

        const tf:TextField = new TextField(this.game,this.fnt);
        tf.textColor.setRGB(233,12,12);
        tf.pos.setXY(10,40);
        tf.setText("< back");
        tf.setFont(this.fnt);
        tf.alpha = 0.7;
        tf.on(MOUSE_EVENTS.click, e=>{
            this.game.popScene();
        });
        this.appendChild(tf);

        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0.2;
        gradient.setColorAtPosition(0,Color.RGBA(100,0,20, 100));
        gradient.setColorAtPosition(1,Color.RGBA(200,111,1));
        rect.fillGradient = gradient;
        rect.borderRadius = 5;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(220,560);
        rect.pos.setXY(100,100);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect);
        rect.transformPoint.setXY(60,30);

    }

}

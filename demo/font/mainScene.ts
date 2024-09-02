import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Button} from "@engine/renderable/impl/ui/button/button";


export class MainScene extends Scene {

    private fnt:Font = Font.fromCssDescription(this.game,{fontSize:50});
    private fnt2:Font = Font.fromCssDescription(this.game,{fontSize:20});

    public override onReady():void {
        const tf:TextField = new TextField(this.game,this.fnt2);
        tf.pos.setY(23);
        tf.setText("no clicks");
        tf.setAutoSize(true);
        tf.textColor.setRGB(0,220,12);
        this.appendChild(tf);

        const btn:Button = new Button(this.game,this.fnt);
        btn.setText("click!");
        btn.pos.setXY(10,110);
        btn.textColor.setRGB(255,0,0);
        const bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 15;
        bg.fillColor = Color.RGB(0,120,1);
        btn.setBackground(bg);
        btn.setPadding(0);
        btn.setAutoSize(true);
        let cnt:number = 0;

        btn.mouseEventHandler.on(MOUSE_EVENTS.click, (e:ObjectMouseEvent)=>{
            console.log('clicked');
            tf.setText(`clicked ${++cnt} times`);
        });
        this.appendChild(btn);

        tf.moveToFront();
    }

}

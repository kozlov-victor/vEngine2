import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {TextField} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {Button} from "@engine/renderable/impl/ui2/button/button";


export class MainScene extends Scene {

    private fnt:Font;
    private fnt2:Font;

    public onPreloading() {
        const fnt:Font = new Font(this.game,{fontSize:50});
        fnt.fontColor = Color.RGB(255,0,0);

        const fnt2:Font = new Font(this.game,{fontSize:20});
        fnt2.fontColor = Color.RGB(0,220,12);

        this.fnt = fnt;
        this.fnt2 = fnt2;
    }

    public onReady() {
        const tf:TextField = new TextField(this.game,this.fnt2);
        tf.pos.setY(23);
        tf.setText("no clicks");
        tf.size.setWH(200,30);
        tf.textColor.setRGB(0,220,12);
        this.appendChild(tf);

        const btn:Button = new Button(this.game,this.fnt);
        btn.setText("click!");
        btn.pos.setXY(10,10);
        btn.textColor.setRGB(255,0,0);
        const bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 15;
        bg.fillColor = Color.RGB(0,120,1);
        btn.setBackground(bg);
        btn.setPadding(60);

        let cnt:number = 0;

        btn.on(MOUSE_EVENTS.click, (e:IObjectMouseEvent)=>{
            console.log('clicked');
            tf.setText(`clicked ${++cnt} times`);
        });
        this.appendChild(btn);

        tf.moveToFront();
    }

}

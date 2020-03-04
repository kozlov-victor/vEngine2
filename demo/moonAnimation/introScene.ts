import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {Button} from "@engine/renderable/impl/ui/components/button";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {MainScene} from "./mainScene";


export class IntroScene extends Scene {

    public onReady() {

    }


    public onPreloading() {
        const fnt:Font = new Font(this.game);
        fnt.fontSize = 50;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(255,0,0);
        fnt.generate();

        const fnt2:Font = new Font(this.game);
        fnt2.fontSize = 20;
        fnt2.fontFamily = 'monospace';
        fnt2.fontColor = Color.RGB(0,220,12);
        fnt2.generate();

        const btn:Button = new Button(this.game);
        btn.setFont(fnt);
        btn.setText("play!");
        btn.pos.setXY(10,10);
        const bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 15;
        bg.fillColor = Color.RGB(0,120,1);
        btn.background = bg;
        btn.setPaddings(15);


        btn.on(MOUSE_EVENTS.click, (e:IObjectMouseEvent)=>{
           this.game.runScene(new MainScene(this.game));
        });
        this.appendChild(btn);



    }

}

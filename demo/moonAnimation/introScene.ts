import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {MainScene} from "./mainScene";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {Resource} from "@engine/resources/resourceDecorators";


export class IntroScene extends Scene {


    @Resource.Font({fontFamily:'monospace',fontSize:50})
    private fnt:Font;

    public onReady():void {
        const btn:Button = new Button(this.game,this.fnt);
        btn.textColor.setRGB(255,0,0);
        btn.setText("play!");
        btn.pos.setXY(10,10);
        const bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 15;
        bg.fillColor = Color.RGB(0,120,1);
        btn.setBackground(bg);
        btn.setPadding(15);


        btn.on(MOUSE_EVENTS.click, (e:IObjectMouseEvent)=>{
            this.game.runScene(new MainScene(this.game));
        });
        this.appendChild(btn);
    }


}

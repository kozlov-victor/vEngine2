import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IObjectMouseEvent, MOUSE_BUTTON} from "@engine/control/mouse/mousePoint";
import {MainScene} from "./mainScene";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {Resource} from "@engine/resources/resourceDecorators";
import {InsetBorder} from "@engine/renderable/impl/geometry/insetBorder";


export class IntroScene extends Scene {


    @Resource.FontFromCssDescription({fontFamily:'monospace',fontSize:50})
    private fnt:Font;

    public onReady():void {
        const btn:Button = new Button(this.game,this.fnt);
        btn.textColor.setRGB(255,0,0);
        btn.setText("play!");
        btn.pos.setXY(10,10);

        const bgNormal:Rectangle = new Rectangle(this.game);
        bgNormal.fillColor = Color.fromCssLiteral('#d4fad4');
        const insetBorder:InsetBorder = new InsetBorder(this.game);
        insetBorder.setColor1(Color.fromCssLiteral('#fff'));
        insetBorder.setColor2(Color.fromCssLiteral('#a4a4a4'));
        insetBorder.setBorderWidth(5);
        bgNormal.appendChild(insetBorder);

        const bgActive:Rectangle = new Rectangle(this.game);
        bgActive.fillColor = Color.fromCssLiteral('#b8fab8');
        const outsetBorder:InsetBorder = new InsetBorder(this.game);
        outsetBorder.setColor1(Color.fromCssLiteral('#a4a4a4'));
        outsetBorder.setColor2(Color.fromCssLiteral('#fff'));
        outsetBorder.setBorderWidth(5);
        bgActive.appendChild(outsetBorder);

        btn.setBackground(bgNormal);
        btn.setBackgroundActive(bgActive);
        btn.setPadding(15);

        btn.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, (e:IObjectMouseEvent)=>{
            if (e.button===MOUSE_BUTTON.LEFT) this.game.runScene(new MainScene(this.game));
        });
        this.appendChild(btn);
    }


}

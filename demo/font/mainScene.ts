import {Scene} from "@engine/core/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {Color} from "@engine/renderer/color";
import {Button} from "@engine/renderable/impl/ui/components/button";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";


export class MainScene extends Scene {

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

        const tf:TextField = new TextField(this.game);
        tf.pos.setY(23);
        tf.setFont(fnt2);
        tf.setText("no clicks");
        this.appendChild(tf);

        const btn:Button = new Button(this.game);
        btn.setFont(fnt);
        btn.setText("click!");
        btn.pos.setXY(10,10);
        const bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 15;
        bg.fillColor = Color.RGB(0,120,1);
        btn.background = bg;
        btn.setPaddings(15);

        let cnt:number = 0;

        btn.on('click',()=>{
           tf.setText(`clicked ${++cnt} times`);
        });
        this.appendChild(btn);


        tf.moveToFront();

    }

}

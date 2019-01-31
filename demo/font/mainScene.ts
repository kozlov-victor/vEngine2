import {Scene} from "@engine/model/impl/scene";
import {Font} from "@engine/model/impl/font";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {TextField} from "@engine/model/impl/ui/components/textField";
import {Color} from "@engine/core/renderer/color";
import {Button} from "@engine/model/impl/ui/components/button";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";


export class MainScene extends Scene {

    tf:TextField;

    onPreloading() {
        let fnt:Font = new Font(this.game);
        fnt.fontSize = 50;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(200,0,12);
        fnt.createContext();
        let link:ResourceLink = this.resourceLoader.loadImage(fnt.createBitmap());
        fnt.setResourceLink(link);
        let tf:TextField = new TextField(this.game);
        tf.setFont(fnt);
        tf.setText("hello");
        this.appendChild(tf);

        let btn:Button = new Button(this.game);
        btn.setFont(fnt);
        btn.setText("click me!");
        btn.pos.setXY(20,90);
        let bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 15;
        bg.fillColor = Color.RGB(0,120,1);
        btn.background = bg;
        btn.setPaddings(15);
        btn.on('click',()=>{
           tf.setText(Math.random().toString());
        });
        this.appendChild(btn);

    }

    onReady() {

    }

}

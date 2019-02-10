import {Scene} from "@engine/model/impl/scene";
import {Font} from "@engine/model/impl/font";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {TextField} from "@engine/model/impl/ui/components/textField";
import {Color} from "@engine/core/renderer/color";
import {Button} from "@engine/model/impl/ui/components/button";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";


export class MainScene extends Scene {


    onPreloading() {
        let fnt:Font = new Font(this.game);
        fnt.fontSize = 50;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(200,0,12);
        fnt.createContext();
        let link:ResourceLink = this.resourceLoader.loadImage(fnt.createBitmap());
        fnt.setResourceLink(link);


        let fnt2:Font = new Font(this.game);
        fnt2.fontSize = 12;
        fnt2.fontFamily = 'monospace';
        fnt2.fontColor = Color.RGB(0,220,12);
        fnt2.createContext();
        let link2:ResourceLink = this.resourceLoader.loadImage(fnt2.createBitmap());
        fnt2.setResourceLink(link2);

        let tf:TextField = new TextField(this.game);
        tf.setFont(fnt2);
        tf.setText("no clicks");
        this.appendChild(tf);

        let btn:Button = new Button(this.game);
        btn.setFont(fnt);
        btn.setText("click!");
        btn.pos.setXY(20,90);
        let bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 15;
        bg.fillColor = Color.RGB(0,120,1);
        btn.background = bg;
        btn.setPaddings(15);

        let cnt:number = 0;

        btn.on('click',()=>{
           tf.setText(`clicked ${++cnt} times`);
        });
        this.appendChild(btn);
    }

    onReady() {

    }

}

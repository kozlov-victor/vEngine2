import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {BasicEnv} from "../oldSymbolScreen/oldScreenEmul";


export class MainScene extends Scene {

    private fnt:Font;

    public onPreloading(){
        this.colorBG = Color.RGB(10,10,30);
        this.fnt = new Font(this.game, {fontSize: 14});
    }

    public onReady() {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.size.set(this.game.size);
        tf.setPadding(5);
        tf.textColor.setRGB(10,100,20);
        tf.setWordBrake(WordBrake.PREDEFINED);

        // https://apkpure.com/gwbasic/com.RetroDoSoft.GwBasic

        const b = new BasicEnv(this.game,tf);
        b.setProgram({
            30: ()=>b.ASSIGN_VAR('P',50),
            31: ()=>b.ASSIGN_VAR('S',50),
            32: ()=>b.ASSIGN_VAR('O',150),
            40: ()=>b.FOR('N',250,50,-10),
            41: ()=>b.ASSIGN_VAR('P',b.GET_VAR('P')+10),
            42: ()=>b.ASSIGN_VAR('S',b.GET_VAR('S')+5),
            43: ()=>b.ASSIGN_VAR('O',b.GET_VAR('O')-5),
            60: ()=>b.LINE(b.GET_VAR('P'),b.GET_VAR('O'),b.GET_VAR('N'),b.GET_VAR('S'),2,'B'),
            61: ()=>b.NEXT('N'),
            70: ()=>b.END(),
        });
        b.RUN();


    }

}

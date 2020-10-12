import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {BasicEnv} from "../oldSymbolScreen/oldScreenEmul";


export class MainScene extends Scene {

    private fnt:Font;

    public onPreloading(){
        this.backgroundColor = Color.RGB(10,10,30);
        this.fnt = new Font(this.game, {fontSize: 14});
    }

    public onReady() {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.size.set(this.game.size);
        tf.setPadding(5);
        tf.textColor.setRGB(10,100,20);
        tf.setWordBrake(WordBrake.PREDEFINED);

        // https://sites.google.com/site/rasstudymaterial/matric-class/gw-basic-programs
        // 10 INPUT "ENTER ANY STRING";ST$
        // 20 FOR OUTER=1 TO LEN(ST$)
        // 30 FOR INNER=1 TO OUTER
        // 40 PRINT MID$(ST$,INNER,1);
        // 50 NEXT INNER
        // 60 PRINT
        // 70 NEXT OUTER
        // 80 END

        const b = new BasicEnv(this.game,tf);
        b.setProgram({
            10: ()=>b.INPUT("ENTER ANY STRING","ST$"),
            20: ()=>b.FOR('OUTER',1,b.LEN(b.GET_VAR('ST$'))),
            30: ()=>b.FOR('INNER',1,b.GET_VAR('OUTER')),
            40: ()=>b.PRINT(b.MID(b.GET_VAR('ST$'),b.GET_VAR('INNER'),1)),
            50: ()=>b.NEXT('INNER'),
            60: ()=>b.PRINT(),
            70: ()=>b.NEXT('OUTER'),
            80: ()=>b.END()
        });
        b.RUN();


    }

}

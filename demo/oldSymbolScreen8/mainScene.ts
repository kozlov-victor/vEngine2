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
        tf.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);

        const b = new BasicEnv(this.game,tf);
        b.setProgram({
            1: ()=>b.ASSIGN_VAR('C',0),
            10: ()=>b.PRINT("HELLO WORLD " + b.GET_VAR('C') ),
            15: ()=>b.PRINT(),
            16: ()=>b.ASSIGN_VAR('C',b.GET_VAR('C')+1),
            20: ()=>b.GOTO(10),
        });
        b.RUN();


    }

}

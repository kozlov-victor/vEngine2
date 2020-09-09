import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {BasicEnv} from "../oldSymbolScreen/oldScreenEmul";
import {Barrel2DistortionFilter} from "@engine/renderer/webGl/filters/texture/barrel2DistortionFilter";


export class MainScene extends Scene {

    private fnt:Font;

    public onPreloading(){
        this.colorBG = Color.RGB(10,10,30);
        this.fnt = new Font(this.game, {fontSize: 14});
        const filter = new Barrel2DistortionFilter(this.game);
        this.filters = [filter];
    }

    public onReady() {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.size.set(this.game.size);
        tf.setPadding(5);
        tf.textColor.setRGB(10,100,20);
        tf.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);

        const b = new BasicEnv(this.game,tf);
        b.setProgram({
            10: ()=>[b.PRINT("Calculation of square root")],
            20: ()=>b.INPUT("Enter number","S"),
            30: [
                () => b.PRINT("Square root of "+b.GET_VAR("S") + " is " + b.SQRT(b.GET_VAR('S'))),
            ],
            40: ()=>b.GOTO(20),
        });
        b.RUN();


    }

}

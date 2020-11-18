import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {RESULT} from "./code";


export class MainScene extends Scene {

    @Resource.Font({fontFamily:'monospace',fontSize:10})
    private fnt:Font;

    public onReady() {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.size.set(this.game.size);
        tf.textColor.setRGB(0,250,0);
        this.appendChild(tf);
        let reverted:boolean = false;
        tf.setText(RESULT(reverted));
        tf.setInterval(()=>{
            reverted=!reverted;
            tf.setText(RESULT(reverted));
        },500);
    }

}

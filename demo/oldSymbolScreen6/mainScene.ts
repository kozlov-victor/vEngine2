import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {BasicEnv} from "../oldSymbolScreen/oldScreenEmul";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize:14})
    private fnt:Font;

    public override onPreloading(taskQueue:TaskQueue):void{
        this.backgroundColor = Color.RGB(10,10,30);
    }

    public override onReady():void {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.size.setFrom(this.game.size);
        tf.setPadding(5);
        tf.textColor.setRGB(10,100,20);
        tf.setWordBrake(WordBrake.PREDEFINED);

        // https://apkpure.com/gwbasic/com.RetroDoSoft.GwBasic

        const b = new BasicEnv(this.game,tf);
        b.setProgram({
            10: ()=>b.FOR('I',0,300, 10),
            40: ()=>b.CIRCLE(b.GET_VAR('I'),b.GET_VAR('I'),b.GET_VAR('I')),
            50: ()=>b.NEXT('I'),
            80: ()=>b.END()
        });
        b.RUN();


    }

}

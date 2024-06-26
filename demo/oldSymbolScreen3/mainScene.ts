import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {BasicEnv} from "../oldSymbolScreen/oldScreenEmul";
import {Barrel2DistortionFilter} from "@engine/renderer/webGl/filters/texture/barrel2DistortionFilter";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize:14})
    public readonly fnt:Font;

    public override onPreloading(taskQueue:TaskQueue):void{
        this.backgroundColor = Color.RGB(10,10,30);
        const filter = new Barrel2DistortionFilter(this.game);
        this.filters = [filter];
    }

    public override onReady():void {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.size.setFrom(this.game.size);
        tf.setPadding(5);
        tf.textColor.setRGB(10,100,20);
        tf.setWordBrake(WordBrake.PREDEFINED);

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

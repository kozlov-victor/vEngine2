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
        tf.size.set(this.game.size);
        tf.setPadding(5);
        tf.textColor.setRGB(10,100,20);
        tf.setWordBrake(WordBrake.PREDEFINED);

        // https://sites.google.com/site/rasstudymaterial/matric-class/gw-basic-programs
        // 10 INPUT "ENTER ANY STRING";ST$
        // 20 FOR J=LEN(ST$) TO 1 STEP -1
        // 30 PRINT MID$(ST$,J,1);
        // 40 NEXT J
        // 50 END

        const b = new BasicEnv(this.game,tf);
        b.setProgram({
            10: ()=>[b.INPUT("ENTER ANY STRING","ST$")],
            18: ()=>[console.log(b.LEN(b.GET_VAR('ST$') as string))],
            20: ()=>b.FOR('J',b.LEN(b.GET_VAR('ST$') as string),1,-1),
            30: ()=>b.PRINT(b.MID(b.GET_VAR('ST$'),b.GET_VAR('J'),1)),
            40: ()=>b.NEXT('J'),
            50: ()=>b.GOTO(10),
        });
        b.RUN();


    }

}

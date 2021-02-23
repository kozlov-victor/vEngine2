import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {BasicEnv} from "../oldSymbolScreen/oldScreenEmul";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";

export class MainScene extends Scene {

    @Resource.Font({fontSize:14})
    private fnt:Font;

    public onPreloading(taskQueue:TaskQueue):void{
        this.backgroundColor = Color.RGB(10,10,30);
    }

    public onReady():void {

        // const parser = new BasicParser();
        // parser.parse(`
        //     10 CLS
        // `);

        const tf:TextField = new TextField(this.game,this.fnt);
        tf.size.set(this.game.size);
        tf.setPadding(5);
        tf.textColor.setRGB(10,100,20);
        tf.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);

        // https://www.youtube.com/watch?v=_vK84lvwQwo&ab_channel=MarkMiller
        const b = new BasicEnv(this.game,tf);
        b.setProgram({
            25: ()=>b.PLOT(135,0),
            27: ()=>b.PLOT(135,135),
            30: ()=>b.FOR('i',0,135,5),
            40: ()=>b.PLOT(0,b.GET_VAR('i')),
            50: ()=>b.DRAW(b.GET_VAR('i'),135),
            60: ()=>b.PLOT(b.GET_VAR('i'),0),
            70: ()=>b.DRAW(135,b.GET_VAR('i')),
            80: ()=>b.NEXT('i'),
            85: ()=>b.FOR('k',0,1000),
            86: ()=>b.NEXT('k'),
            90: ()=>b.CLS(),
            100: ()=>b.GOTO(25),
        });
        b.RUN();


    }

}

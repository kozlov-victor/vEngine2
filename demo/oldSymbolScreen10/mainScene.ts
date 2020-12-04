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

        // https://www.youtube.com/watch?v=zPxSvMIsmJU&ab_channel=JohnMetcalf
        const b = new BasicEnv(this.game,tf);
        b.setProgram({
            10:  ()=>b.CLS(),
            20:  ()=>b.ASSIGN_VAR('e',0),
            30:  ()=>b.ASSIGN_VAR('v',0),
            40:  ()=>b.ASSIGN_VAR('e',b.GET_VAR('e')+0.365256/Math.PI),
            50:  ()=>b.ASSIGN_VAR('v',b.GET_VAR('v')+0.224701/Math.PI),
            60:  ()=>b.IF(b.GET_VAR('e')>(2*Math.PI),()=>b.ASSIGN_VAR('e',0)),
            70:  ()=>b.IF(b.GET_VAR('v')>(2*Math.PI),()=>b.ASSIGN_VAR('v',0)),
            80:  ()=>b.ASSIGN_VAR('x0',88+b.COS(b.GET_VAR('e'))*87),
            90:  ()=>b.ASSIGN_VAR('y0',88+b.SIN(b.GET_VAR('e'))*87),
            100: ()=>b.ASSIGN_VAR('x1',88+b.COS(b.GET_VAR('v'))*62.9238),
            110: ()=>b.ASSIGN_VAR('y1',88+b.SIN(b.GET_VAR('v'))*62.9238),
            120: ()=>b.PLOT(b.GET_VAR('x0'),b.GET_VAR('y0')),
            130: ()=>b.DRAW(b.GET_VAR('x1')-b.GET_VAR('x0'),b.GET_VAR('y1')-b.GET_VAR('y0')),
            150: ()=>b.GOTO(40),

        });
        b.RUN();


    }

}

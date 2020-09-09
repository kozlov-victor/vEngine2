import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {BasicEnv} from "../oldSymbolScreen/oldScreenEmul";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";


// this is interpretation of
// http://vintage-basic.net/bcg/sinewave.bas

export class MainScene extends Scene {

    public fnt!:Font;

    public onPreloading(){
        this.colorBG = Color.RGB(10,10,30);
        this.fnt = new Font(this.game, {fontSize: 14});
    }

    public onReady() {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.size.set(this.game.size);
        tf.setPadding(5);
        tf.textColor.setRGB(10,100,20);
        tf.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);
        const filter = new NoiseHorizontalFilter(this.game);
        tf.filters = [filter];

        // 10 PRINT TAB(30);"SINE WAVE"
        // 20 PRINT TAB(15);"CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY"
        // 30 PRINT: PRINT: PRINT: PRINT: PRINT
        // 40 REMARKABLE PROGRAM BY DAVID AHL
        // 50 B=0
        // 100 REM  START LONG LOOP
        // 110 FOR T=0 TO 40 STEP .25
        // 120 A=INT(26+25*SIN(T))
        // 130 PRINT TAB(A);
        // 140 IF B=1 THEN 180
        // 150 PRINT "CREATIVE"
        // 160 B=1
        // 170 GOTO 200
        // 180 PRINT "COMPUTING"
        // 190 B=0
        // 200 NEXT T
        // 999 END


        const b = new BasicEnv(this.game,tf);
        b.setProgram({
            10: [
                ()=>b.PRINT_TAB(30),
                ()=>b.PRINT("SINE WAVE")
            ],
            20: [
                ()=>b.PRINT_TAB(15),
                ()=>b.PRINT("CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY")
            ],
            30: [
                ()=>b.PRINT(),
                ()=>b.PRINT(),
                ()=>b.PRINT(),
                ()=>b.PRINT(),
            ],
            40: ()=>b.REM("PROGRAM BY DAVID AHL"),
            50: [
                ()=>b.ASSIGN_VAR('B',0),
            ],
            100: [
                ()=>b.REM("START LONG LOOP"),
            ],
            110: [
                ()=>b.FOR('T',0,40,0.25)
            ],
            120: [ // A=INT(26+25*SIN(T))
                ()=>b.ASSIGN_VAR('A',b.INT(26+25*b.SIN(b.GET_VAR('T'))))
            ],
            130: [
                ()=>b.PRINT_TAB(b.GET_VAR('A'))
            ],
            140: [ // IF B=1 THEN 180
                ()=>b.IF(b.GET_VAR('B')===1,()=>b.GOTO(180))
            ],
            150: ()=>b.PRINT("CREATIVE"),
            160: ()=>b.ASSIGN_VAR('B',1),
            170: ()=>b.GOTO(200),
            180: ()=>b.PRINT("COMPUTING"),
            190: ()=>b.ASSIGN_VAR("B",0),
            200: ()=>b.NEXT('T'),
            999: ()=>b.END(),


        });

        b.RUN();


    }

}

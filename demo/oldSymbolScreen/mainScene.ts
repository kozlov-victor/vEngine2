import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {BasicEnv} from "./oldScreenEmul";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/texture/barrelDistortionFilter";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";


// this is interpretation of
// http://vintage-basic.net/games.html
// http://vintage-basic.net/bcg/bunny.bas

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize:14})
    public fnt:Font;

    public override onPreloading(taskQueue:TaskQueue):void{
        super.onPreloading(taskQueue);
        this.backgroundColor = Color.RGB(10,10,30);
    }

    public override onReady():void {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.size.set(this.game.size);
        tf.setPadding(5);
        tf.textColor.setRGB(10,100,20);
        tf.setWordBrake(WordBrake.PREDEFINED);
        const filter = new BarrelDistortionFilter(this.game);
        this.filters = [filter];


        const b = new BasicEnv(this.game,tf);
        b.setProgram({

            10: [
                ()=>b.PRINT_TAB(33),
                ()=>b.PRINT("BUNNY")
            ],
            20: [
                ()=>b.PRINT_TAB(15),
                ()=>b.PRINT("CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY")
            ],
            30: [
                ()=>b.PRINT(),
                ()=>b.PRINT(),
                ()=>b.PRINT()
            ],
            100: ()=>b.REM("\"BUNNY\" FROM AHL'S 'BASIC COMPUTER GAMES'"),
            110: ()=>b.REM(),
            120: [
                ()=>b.FOR('i',0,4),
                ()=>b.DEBUG(),
                ()=>b.READ('b',b.GET_VAR('i')),
                ()=>b.NEXT('i')
            ],
            130: ()=>b.GOSUB(260),
            140: ()=>b.ASSIGN_VAR('l',64),
            160: ()=>b.PRINT(),
            170: [
                ()=>b.READ('x'),
                ()=>b.IF(b.GET_VAR('x')<0,()=>b.GOTO(160))
            ],
            175: ()=>b.IF(b.GET_VAR('x')>128,()=>b.GOTO(240)),
            180: [
                ()=>b.PRINT_TAB(b.GET_VAR('x')),
                ()=>b.READ('y')
            ],
            190: [
                ()=>b.FOR('i',b.GET_VAR('x'),b.GET_VAR('y')),
                ()=>b.ASSIGN_VAR('j',b.GET_VAR('i')-5*b.INT(b.GET_VAR('i')/5)),
            ],
            200: ()=>b.PRINT(
                b.CHR$(
                    b.GET_VAR('l')+
                    b.GET_VAR('b',b.GET_VAR('j'))
                )
            ),
            210: ()=>b.NEXT('i'),
            220: ()=>b.GOTO(170),
            240: [
                ()=>b.GOSUB(260),
                ()=>b.GOTO(450)
            ],
            260: [
                ()=>b.FOR('i',1,6),
                ()=>b.PRINT(b.CHR$(10)),
                ()=>b.NEXT('i')
            ],
            270: ()=>b.RETURN(),


            290: b.DATA([
                2,21,14,14,25,
                1,2,-1,0,2,45,50,-1,0,5,43,52,-1,0,7,41,52,-1,
                1,9,37,50,-1,2,11,36,50,-1,3,13,34,49,-1,4,14,32,48,-1,
                5,15,31,47,-1,6,16,30,45,-1,7,17,29,44,-1,8,19,28,43,-1,
                9,20,27,41,-1,10,21,26,40,-1,11,22,25,38,-1,12,22,24,36,-1,
                13,34,-1,14,33,-1,15,31,-1,17,29,-1,18,27,-1,
                19,26,-1,16,28,-1,13,30,-1,11,31,-1,10,32,-1,
                8,33,-1,7,34,-1,6,13,16,34,-1,5,12,16,35,-1,
                4,12,16,35,-1,3,12,15,35,-1,2,35,-1,1,35,-1,
                2,34,-1,3,34,-1,4,33,-1,6,33,-1,10,32,34,34,-1,
                14,17,19,25,28,31,35,35,-1,15,19,23,30,36,36,-1,
                14,18,21,21,24,30,37,37,-1,13,18,23,29,33,38,-1,
                12,29,31,33,-1,11,13,17,17,19,19,22,22,24,31,-1,
                10,11,17,18,22,22,24,24,29,29,-1,
                22,23,26,29,-1,27,29,-1,28,29,-1,4096,
            ]),


            450: ()=>b.END(),



        });
        b.RUN();


    }

}

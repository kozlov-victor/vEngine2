import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TextField, WORD_BRAKE} from "@engine/renderable/impl/ui/components/textField";
import {SCR} from "./oldScreenEmul";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";


// this is interpretation of
// http://vintage-basic.net/bcg/bunny.bas

export class MainScene extends Scene {

    public fnt!:Font;

    public onPreloading(){
        this.colorBG = Color.RGB(10,10,30);
        const fnt:Font = new Font(this.game);
        fnt.fontSize = 8;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(10,100,20);
        fnt.generate();
        this.fnt = fnt;
    }

    public onReady() {
        const tf:TextField = new TextField(this.game);
        tf.pos.setXY(10);
        tf.setFont(this.fnt);
        tf.setWordBreak(WORD_BRAKE.PREDEFINED);
        this.appendChild(tf);
        tf.setText(SCR);

        const filter = new WaveFilter(this.game);
        this.filters = [filter];

    }

}

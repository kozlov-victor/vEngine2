import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";


export class MainScene extends Scene {

    @Resource.Font('monospace',50)
    private fnt:Font;

    public onReady() {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.pos.setY(23);
        tf.textColor.setRGB(255,0,0);
        tf.setText("test_font");
        this.appendChild(tf);
        let cnt = 0;
        let cntOld:number;
        this.setInterval(()=>{
            if (cntOld!==undefined) tf.setColorAt(cntOld,{r:255,g:0,b:0,a:255});
            tf.setColorAt(cnt,{r:255,g:25,b:200,a:255});
            cntOld = cnt;
            cnt++;
            cnt%=tf.getText().length;
        },300);
    }


}

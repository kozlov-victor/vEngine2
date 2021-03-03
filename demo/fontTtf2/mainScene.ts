import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {fontLoader} from "../fontTtf/FontLoader";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {TaskQueue} from "@engine/resources/taskQueue";
import loadFont = fontLoader.loadFont;


export class MainScene extends Scene {

    private fnt:Font;
    private tf:TextField;

    public onPreloading(taskQueue:TaskQueue):void {
        loadFont(this.game,taskQueue,'./fontTtf2/zx.ttf','zx');
        taskQueue.addNextTask(async _=>{
            this.fnt = await taskQueue.getLoader().loadFontFromCssDescription({fontSize:30,fontFamily:'zx'});
        });

    }

    public onReady():void {
        console.log('ready');
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.pos.setY(23);
        this.tf = tf;
        this.tf.setFont(this.fnt);
        this.tf.textColor.setRGB(122,23,44);
        this.tf.setWordBrake(WordBrake.PREDEFINED);
        this.tf.setText("zx spectrum font\nКирилица");
        this.appendChild(this.tf);

    }

}

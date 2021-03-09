import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Resource} from "@engine/resources/resourceDecorators";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical
} from "@engine/renderable/impl/ui/textField/textAlign";
import {TaskQueue} from "@engine/resources/taskQueue";

const text:string=
`Lorem ipsum dolor sit amet,\t\n\r
consectetur
adipiscing elit,
sed do eiusmod
tempor incididunt ut labore et
dolore magna aliqua.
Ut enim ad minim veniam,
quis nostrud exercitation
ullamco laboris nisi ut
aliquip ex ea
commodo consequat.`;

declare const WebFont:any;

export const loadScript = (taskQueue:TaskQueue)=>{
    taskQueue.addNextTask(async _=>{
        let resolveFn:()=>void;
        const p = new Promise<void>((resolve, reject) => resolveFn = resolve);
        const script = document.createElement('script');
        script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js';
        document.body.appendChild(script);
        script.onload = ()=>{
            WebFont.load({
                google: {
                    families: ['Droid Sans', 'Droid Serif:bold']
                },
                active: ()=>{
                    setTimeout(()=>{
                        resolveFn();
                    },1000);
                }
            });
        };
        return p;
    });
};

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize:30,fontFamily:'Droid Sans'})
    private fnt:Font;

    onPreloading(taskQueue:TaskQueue):void {
        loadScript(taskQueue);
    }

    public onReady():void {

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);

        tf.pos.setXY(50,50);
        tf.size.setWH(450,520);
        tf.setAlignText(AlignText.JUSTIFY);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.TOP);
        tf.textColor.setRGB(12,132,255);
        const background = new Rectangle(this.game);
        background.fillColor = Color.RGB(40);
        background.borderRadius = 5;
        tf.setText(text);
        tf.setBackground(background);
        tf.setPadding(10);
        tf.setMargin(20);
        this.appendChild(tf);


    }

}

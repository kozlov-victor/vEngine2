import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Resource} from "@engine/resources/resourceDecorators";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {CheckBox} from "@engine/renderable/impl/ui/toggleButton/checkBox";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {ScrollView} from "@engine/renderable/impl/ui/scrollViews/scrollView";
import {Size} from "@engine/geometry/size";
import {SelectBox} from "@engine/renderable/impl/ui/selectBox/selectBox";

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontFamily:'monospace',fontSize:25})
    public fnt:Font;

    public onReady():void {

        this.backgroundColor = Color.RGB(244,244,233);

        const bg = new Rectangle(this.game);
        bg.fillColor = Color.RGBA(12,12,222, 255);
        bg.lineWidth = 1;
        bg.borderRadius = 10;

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);
        tf.size.setWH(450,300);
        tf.setBackground(bg);
        tf.textColor.setRGB(122,244,245);
        tf.setMargin(10,10);
        tf.setPadding(20,10);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.setAlignText(AlignText.JUSTIFY);
        tf.setText("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
        this.appendChild(tf);

        const tf3:TextField = new ScrollableTextField(this.game,this.fnt);
        tf3.size.setWH(250,300);
        tf3.pos.setXY(460,0);
        tf3.setBackground(bg.clone());
        tf3.setMargin(10,10);
        tf3.setPadding(20,10);
        tf3.textColor.setRGB(122,200,245);
        tf3.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf3.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf3.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);
        tf3.setText("\n" +
            "     Lorem    ipsum dolor sit amet, consectetur \n" +
            "adipiscing     elit,     sed do eiusmod tempor incididunt \n" +
            "ut labore et dolore magna aliqua. Ut enim ad minim \n" +
            "\n\n\n\n"+
            "1\n"+
            "\n"+
            "\n"+
            "1\n"+
            "Lorem ipsum dolor sit amet"
        );
        this.appendChild(tf3);

        const checkBox = new CheckBox(this.game);
        checkBox.pos.setXY(20,300);
        this.appendChild(checkBox);

        const btn = new Button(this.game,this.fnt);
        const bg2 = new Rectangle(this.game);
        bg2.fillColor = Color.RGBA(122,122,222, 255);
        bg2.lineWidth = 1;
        bg2.borderRadius = 10;
        btn.setBackground(bg2);

        const bg2Active = new Rectangle(this.game);
        bg2Active.fillColor = Color.fromCssLiteral('#38774c');
        bg2Active.lineWidth = 1;
        bg2Active.borderRadius = 10;
        btn.setBackgroundActive(bg2Active);

        btn.pos.setXY(150,300);
        btn.size.setWH(200,100);
        btn.setText("click me");
        btn.textColor.setRGB(222,144,255);
        this.appendChild(btn);

        const tf2 = new RichTextField(this.game,this.fnt);
        tf2.setAutoSize(true);
        tf2.setWordBrake(WordBrake.PREDEFINED);
        tf2.setAlignText(AlignText.CENTER);
        tf2.pos.setXY(150,430);
        tf2.setText("-==no data==-");
        this.appendChild(tf2);
        tf2.textColor.setRGB(22,44,45);
        let cnt:number = 0;
        const redColor:IColor = {r:255,g:100,b:100};
        const greenColor:IColor = {r:100,g:200,b:100};
        btn.on(MOUSE_EVENTS.click, e=>{
            if (checkBox.checked) cnt+=1;
            else cnt-=1;
            tf2.setRichText(
                <div>
                    clicked <v_font color={cnt>0?greenColor:redColor} size={50}><u>{cnt}</u></v_font> times
                    {'\n'}
                    <u>current value is</u> {cnt} (value is {cnt>0?'positive':'negative'})
                </div>
            );
        });

        const scrollView:ScrollView = new ScrollView(this.game);
        const scrollBg = new Rectangle(this.game);
        scrollBg.fillColor = Color.fromCssLiteral(`#fff`);
        scrollView.setBackground(scrollBg);

        const scrollBgActive = new Rectangle(this.game);
        scrollBgActive.fillColor = Color.fromCssLiteral(`#eae9e9`);
        scrollView.setBackgroundActive(scrollBgActive);

        const scrollBgHover = new Rectangle(this.game);
        scrollBgHover.fillColor = Color.fromCssLiteral(`#efe0e0`);
        scrollView.setBackgroundHover(scrollBgHover);

        scrollView.pos.setXY(400,300);
        scrollView.size.setWH(300,100);
        scrollView.scrollableContainer.size.set(new Size(410,400));
        scrollView.setMargin(10);
        scrollView.setPadding(5);
        const label:TextField = new  TextField(this.game,this.fnt);
        label.setText("scroll");
        label.setAutoSize(true);
        label.alpha = 0.6;
        label.pos.setXY(20,30);
        label.on(MOUSE_EVENTS.click, e=>{
            console.log('rect',e);
        });
        scrollView.scrollableContainer.appendChild(label);
        this.appendChild(scrollView);

        const selectBox = new SelectBox(this.game,this.fnt);
        const selectBoxBg = new Rectangle(this.game);
        selectBoxBg.fillColor = Color.fromCssLiteral(`#adb4ff`);
        selectBox.setBackground(selectBoxBg);

        const selectBoxBgSelected = new Rectangle(this.game);
        selectBoxBgSelected.fillColor = Color.fromCssLiteral(`#49ef6e`);
        selectBox.setBackgroundSelected(selectBoxBgSelected);

        selectBox.size.setWH(130,100);
        selectBox.pos.setXY(370,500);
        selectBox.setSelectedIndex(3);
        selectBox.setOptions([
            'Volkswagen Passat',
            'Subaru Legacy',
            'Hyundai Elantra',
            'Honda Civic',
            'Audi A6',
            'AutoZAZ DAEWOO'
        ]);
        this.appendChild(selectBox);

    }

}

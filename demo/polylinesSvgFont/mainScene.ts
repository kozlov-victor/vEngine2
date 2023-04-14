import {Scene} from "@engine/scene/scene";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {XmlParser} from "@engine/misc/parsers/xml/xmlParser";
import {Color} from "@engine/renderer/common/color";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {FontContextSvgFactory} from "./fontContextSvgFactory";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";


export class MainScene extends Scene {


    public override async onReady():Promise<void> {

        const fonts:[string,number][] = [
            ['test',30],
            ['zx',30],
            ['vintage',30],
            ['PressStart2P',30],
            ['MK4',30],
        ];

        let i = -1;
        let lastTf:TextField;
        let text = 'vEngine (c) ZX Spectrum Font';

        const loadNextFont = async (inc:number)=> {
            i += inc;
            if (i < 0) i = fonts.length - 1;
            else if (i > fonts.length - 1) i = 0;
            if (lastTf) {
                text = lastTf.getText();
                lastTf.removeSelf();
            }

            const xmlRaw = await new ResourceLoader(this.game).loadText(`./polylinesSvgFont/${fonts[i][0]}.svg`);
            const document = new XmlParser(xmlRaw).getTree();

            const standardChars:string[] =
                document.getElementsByTagName('glyph').
                map(it=>FontContextSvgFactory.hexEntityToStr(it.getAttribute('unicode'))).filter(it=>it);
            const factory = new FontContextSvgFactory(this.game,document,fonts[i][1]);
            const font = factory.createFont(standardChars,[],'',factory.getFontSize());

            const textField = new EditTextField(this.game,font);
            textField.size.setFrom(this.game.size);
            textField.textColor.setFrom(Color.BLACK);
            textField.setText(text);
            textField.setPixelPerfect(true);
            this.backgroundColor = ColorFactory.fromCSS('#f1f1f1');
            this.appendChild(textField);
            lastTf = textField;
        };

        loadNextFont(1).then();
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            if (e.button===KEYBOARD_KEY.ADD) loadNextFont(1).then();
        });

    }

}

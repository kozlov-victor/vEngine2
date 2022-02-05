import {Scene} from "@engine/scene/scene";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {XmlParser} from "@engine/misc/parsers/xml/xmlParser";
import {Color} from "@engine/renderer/common/color";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {FontContextSvgFactory} from "./fontContextSvgFActory";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class MainScene extends Scene {


    public override async onReady():Promise<void> {

        const xmlRaw = await new ResourceLoader(this.game).loadText('./polylinesSvgFont/zx.svg');
        const document = new XmlParser(xmlRaw).getTree();

        const standartChars:string[] =
            document.getElementsByTagName('glyph').
            map(it=>FontContextSvgFactory.hexEntityToStr(it.getAttribute('unicode'))).filter(it=>it);
        const font = new FontContextSvgFactory(this.game,document,0.05).createFont(standartChars,[],'',12);

        const textField = new EditTextField(this.game,font);
        textField.size.setFrom(this.game.size);
        textField.textColor.setFrom(Color.BLACK);
        textField.setText('vEngine (c) ZX Spectrum Font');
        textField.setPixelPerfect(true);
        this.backgroundColor = ColorFactory.fromCSS('#f1f1f1');
        this.appendChild(textField);

    }

}

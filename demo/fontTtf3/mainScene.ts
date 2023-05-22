import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {SVGFont} from "@engine/misc/parsers/ttf/svgFont";


export class MainScene extends Scene {

    @Resource.Binary('./test.ttf')
    private buff:ArrayBuffer;


    public override onReady():void {
        console.log(this.buff);
        const fnt = SVGFont.renderToXml(this.buff);
        console.log(fnt);
    }

}

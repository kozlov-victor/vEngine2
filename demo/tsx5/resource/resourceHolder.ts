import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {MathEx} from "@engine/misc/math/mathEx";
import {NoiseFilter} from "@engine/renderer/webGl/filters/texture/noiseFilter";
import * as fntXML from "xml/angelcode-loader!./font/pixel.fnt";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class ResourceHolder extends ResourceAutoHolder {


    public buttonBg = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`#effaef`);
        rect.lineWidth = 0;
        return rect;
    })();


    public buttonBgActive = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`#ffe0e0`);
        rect.lineWidth = 0;
        return rect;
    })();

    public textFieldBg = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`#c6f3c9`);
        rect.lineWidth = 1;
        rect.color = ColorFactory.fromCSS('#000');
        return rect;
    })();

    public textFieldFilter1 = (()=>{
        const filter = new NoiseFilter(this.scene.getGame());
        this.scene.setInterval(()=>{
            const r = MathEx.randomInt(0,10);
            filter.enabled = r>5;
        },500);
        return filter;
    })();

    public checkBoxCheckedBg = (()=>{
        const background = new Circle(this.scene.getGame());
        background.fillColor = ColorFactory.fromCSS(`#d2d5ff`);
        return background;
    })();

    @Resource.Image('./steamSeaBattle/data/images/btnOn.png')
    public imgOn:Image;

    @Resource.Image('./tsx5/resource/img/progressBarPattern.png')
    public progressBarPattern:Image;


    @Resource.Image('./steamSeaBattle/data/images/btnOff.png')
    public imgOff:Image;

    @Resource.FontFromAtlas('./tsx5/resource/font',fntXML)
    public fnt:Font;

}

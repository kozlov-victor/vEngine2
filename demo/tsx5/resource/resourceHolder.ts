import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {MathEx} from "@engine/misc/mathEx";
import {NoiseFilter} from "@engine/renderer/webGl/filters/texture/noiseFilter";
import * as fntXML from "xml/angelcode-loader!./font/pixel.fnt";

export class ResourceHolder extends ResourceAutoHolder {


    public buttonBg = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = Color.fromCssLiteral(`#effaef`);
        rect.lineWidth = 0;
        return rect;
    })();


    public buttonBgActive = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = Color.fromCssLiteral(`#ffe0e0`);
        rect.lineWidth = 0;
        return rect;
    })();

    public textFieldBg = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = Color.fromCssLiteral(`#c6f3c9`);
        rect.lineWidth = 1;
        rect.color = Color.fromCssLiteral('#000');
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


    @Resource.FontFromAtlas('./tsx5/resource/font',fntXML)
    public fnt:Font;

}

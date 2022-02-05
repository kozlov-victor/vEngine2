import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class Assets extends ResourceAutoHolder {

    @Resource.FontFromCssDescription({fontFamily: 'monospace', fontSize: 25})
    public fnt: Font;

    public buttonBg: Rectangle = (() => {
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`rgba(6, 125, 68, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public textBg: Rectangle = (() => {
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`rgba(18, 86, 227, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public buttonBgActive: Rectangle = (() => {
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`rgba(255, 98, 0, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
}

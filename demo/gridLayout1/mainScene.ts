import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {GridLayout} from "@engine/renderable/impl/ui/layouts/gridLayout";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {Font} from "@engine/renderable/impl/general/font/font";


export class MainScene extends Scene {

    private createElement() {
        const btn = new Button(this.game,Font.getSystemFont(this.game));
        const hover = new Rectangle(this.game);
        hover.color.setFrom(ColorFactory.fromCSS('#008826'));
        hover.fillColor.setFrom(ColorFactory.fromCSS('#044bd9'));
        hover.borderRadius = 5;
        btn.setBackgroundHover(hover);
        btn.setText(new Date().getTime());
        return btn;
    }

    public override onReady():void {
        const layout = new GridLayout(this.game,5);
        layout.size.setFrom(this.game);
        layout.appendTo(this);
        layout.appendChild(this.createElement());
        this.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
            layout.appendChild(this.createElement());
        });
    }

}

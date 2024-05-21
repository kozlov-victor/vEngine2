import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
export class MainScene extends Scene {

    public override onReady():void {
        const ctx = new DrawingSurface(this.game,this.game.size);
        ctx.appendTo(this);
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                const rgb = `rgb(0 ${Math.floor(255 - 42.5 * i)} ${Math.floor(255 - 42.5 * j)})`;
                ctx.setDrawColor(ColorFactory.fromCSS(rgb));
                ctx.drawArc(12.5 + j * 25, 12.5 + i * 25, 10, 0, 2 * Math.PI, true);
            }
        }
        this.keyboardEventHandler.onceKeyPressed(KEYBOARD_KEY.ENTER,e=>{
            ctx.clear();
            // draw background
            ctx.setFillColor(ColorFactory.fromCSS("#FD0"));
            ctx.drawRect(0, 0, 75, 75);
            ctx.setFillColor(ColorFactory.fromCSS("#6C0"));
            ctx.drawRect(75, 0, 75, 75);
            ctx.setFillColor(ColorFactory.fromCSS("#09F"));
            ctx.drawRect(0, 75, 75, 75);
            ctx.setFillColor(ColorFactory.fromCSS("#F30"));
            ctx.drawRect(75, 75, 75, 75);
            ctx.setFillColor(ColorFactory.fromCSS("#FFF"));

            // set transparency value
            ctx.setGlobalAlpha(0.2);

            // Draw semi transparent circles
            ctx.setFillColor(ColorFactory.fromCSS('white'));
            for (let i = 0; i < 7; i++) {
                ctx.fillArc(75, 75, 10 + 10 * i, 0, Math.PI * 2, true);
            }
        });
    }
}

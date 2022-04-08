import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {RadialGradient} from "@engine/renderable/impl/fill/radialGradient";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DebugLayer} from "@engine/scene/debugLayer";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class MainScene extends Scene {

    public override onReady():void {
        // https://cssgradient.io/
        const rect:Rectangle = new Rectangle(this.game);
        const gradient:RadialGradient  = new RadialGradient();
        gradient.setColorAtPosition(0,ColorFactory.fromCSS(`rgba(255, 161, 0, 0.93)`));
        gradient.setColorAtPosition(0.55,ColorFactory.fromCSS(`rgba(89, 165, 132, 0.91)`));
        gradient.setColorAtPosition(0.8,ColorFactory.fromCSS(`rgba(83, 62, 202, 0.91)`));
        gradient.setColorAtPosition(1,ColorFactory.fromCSS(`hsla(83, 51%, 48%, 0.58)`));
        rect.fillGradient = gradient;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 0;
        rect.size.setFrom(this.game.size);
        this.appendChild(rect);
        const divElement = document.getElementById('divElement')!;
        divElement.style.backgroundImage = gradient.asCSS();
        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);

        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, e=>{
            const x = e.sceneX / this.game.width;
            const y = e.sceneY / this.game.height;
            gradient.center.setXY(x,y);
            debugLayer.clearLog();
            debugLayer.log({x,y});
            divElement.style.backgroundImage = gradient.asCSS();
        });

    }

}

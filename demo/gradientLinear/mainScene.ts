import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {DebugLayer} from "@engine/scene/debugLayer";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class MainScene extends Scene {

    public override onReady():void {
        // https://cssgradient.io/
        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0;
        gradient.setColorAtPosition(0,ColorFactory.fromCSS(`rgba(255, 161, 0, 0.81)`));
        gradient.setColorAtPosition(0.55,ColorFactory.fromCSS(`rgba(89, 165, 132, 0.45)`));
        gradient.setColorAtPosition(0.8,ColorFactory.fromCSS(`rgba(83, 62, 202, 0.8)`));
        gradient.setColorAtPosition(1,ColorFactory.fromCSS(`hsla(83, 51%, 48%, 0.87)`));
        rect.fillGradient = gradient;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 0;
        rect.size.setFrom(this.game.size);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect);
        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);
        const divElement = document.getElementById('divElement')!;
        rect.setInterval(()=>{
            gradient.angle-=0.01;
            divElement.style.backgroundImage = gradient.asCSS();
            debugLayer.clearLog();
            debugLayer.log(gradient.angle);
        },100);

    }

}

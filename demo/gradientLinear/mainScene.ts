import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {DebugLayer} from "@engine/scene/debugLayer";


export class MainScene extends Scene {

    public override onReady():void {
        // https://cssgradient.io/
        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0;
        gradient.setColorAtPosition(0,Color.fromCssLiteral(`#ffa100`));
        gradient.setColorAtPosition(0.55,Color.fromCssLiteral(`#59a584`));
        gradient.setColorAtPosition(0.8,Color.fromCssLiteral(`#533eca`));
        gradient.setColorAtPosition(1,Color.fromCssLiteral(`hsl(83, 51%, 48%)`));
        rect.fillGradient = gradient;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 0;
        rect.size.set(this.game.size);
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

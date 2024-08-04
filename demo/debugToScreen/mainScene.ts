import {Scene} from "@engine/scene/scene";
import {DebugLayer} from "@engine/scene/debugLayer";
import {Rect} from "@engine/geometry/rect";
import {MathEx} from "@engine/misc/math/mathEx";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";

export class MainScene extends Scene {

    public override onReady():void {

        this.backgroundColor = ColorFactory.fromCSS(`rgba(14, 0, 37, 0.35)`);
        this.game.getRenderer<WebGlRenderer>().setPixelPerfect(true);

        const debugLayer = new DebugLayer(this.game);
        debugLayer.getTextField().textColor.setFrom(ColorFactory.fromCSS('green'));
        this.appendChild(debugLayer);
        debugLayer.log(null,undefined,{test:42});
        debugLayer.log('test log');
        debugLayer.log(document);
        debugLayer.log(document.body);
        debugLayer.log(this);
        debugLayer.log(debugLayer);
        debugLayer.log(Number);
        debugLayer.log(new Rect());
        debugLayer.log('В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!');
        debugLayer.log('Глянь (!): що ж є шрифт, цей спазм — ґід букв? Юч їх.');
        debugLayer.log('Фабрикуймо гідність, лящім їжею, ґав хапаймо, з’єднавці чаш!');

        const codeLines = [
            ...this.game.constructor.toString().split('\n'),
            ...this.constructor.toString().split('\n'),
            ...this.game.getRenderer().constructor.toString().split('\n'),
        ];

        this.setInterval(()=>{
            debugLayer.log(codeLines[MathEx.randomInt(0,codeLines.length-1)]);
        },1000);
    }

}

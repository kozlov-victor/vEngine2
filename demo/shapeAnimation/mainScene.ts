import {Scene} from "@engine/scene/scene";
import {ShapeAnimation} from "@engine/animation/shapeAnimation/shapeAnimation";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Color} from "@engine/renderer/common/color";
import {EasingElastic} from "@engine/misc/easing/functions/elastic";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class MainScene extends Scene {


    public override onReady():void {

        const container:RenderableModel = new SimpleGameObjectContainer(this.game);
        this.appendChild(container);
        //const from = 'M210 410 h 10 v 10 h -10 v -10';
        const from = 'M322.8025360053676,274.8393559205641 L388.1191875159626,274.8393559205641 L408.3025354350115,207.6131438189987 L428.48589483057646,274.8393559205641 L493.80253486465296,274.8393559205641 L440.9603504856112,316.3869643244233 L461.1447427670713,383.6131764259892 L408.3025354350115,342.0644365489424 L355.46033957946094,383.6131764259892 L375.6447375991793,316.3869643244233 L322.8025360053676,274.8393559205641 z';
        const to = 'M406.05218243670544,125.81098402099057 C436.97431241311295,11.224837339454975 558.1282315010126,125.81098402099057 406.05218243670544,273.13602975439113 C253.97613337240028,125.81098402099057 375.13005246030116,11.224837339454975 406.05218243670544,125.81098402099057 z';
        const shapeAnimation = new ShapeAnimation(this.game,Polygon.fromSvgPath(this.game,from),Polygon.fromSvgPath(this.game,to),container,6000,EasingElastic.InOut);
        shapeAnimation.play();
        shapeAnimation.onProgress(p=>{
            p.fillColor = ColorFactory.fromCSS('#e51e1e');
        });
    }

}

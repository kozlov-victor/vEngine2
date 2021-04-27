import {Scene} from "@engine/scene/scene";
import {MainWidget} from "./ui/mainWidget";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {ResourceHolder} from "./resource/resourceHolder";
import {Color} from "@engine/renderer/common/color";
import {HorizontalNumericSlider} from "@engine/renderable/impl/ui/numericSlider/horizontalNumericSlider";
import {VerticalNumericSlider} from "@engine/renderable/impl/ui/numericSlider/verticalNumericSlider";


export class MainScene extends Scene {

    private resourceHolder:ResourceHolder = new ResourceHolder(this);

    public onReady():void {
        this.backgroundColor = Color.fromCssLiteral(`#efefef`);
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);

        const mainSceneUI = new MainWidget(this.game,this.resourceHolder);
        //mainSceneUI.mountTo(root);

        const h:HorizontalNumericSlider = new HorizontalNumericSlider(this.game);
        h.pos.setXY(50,50);
        h.size.setWH(300,50);
        h.setPadding(5);
        this.appendChild(h);

        const v:VerticalNumericSlider = new VerticalNumericSlider(this.game);
        v.pos.setXY(50,120);
        v.size.setWH(50,300);
        v.setPadding(5);
        this.appendChild(v);

    }

}

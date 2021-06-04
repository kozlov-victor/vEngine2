import {Scene} from "@engine/scene/scene";
import {MainWidget} from "./ui/mainWidget";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {ResourceHolder} from "./resource/resourceHolder";
import {Color} from "@engine/renderer/common/color";
import {STRETCH_MODE} from "@engine/renderable/impl/general/image";


export class MainScene extends Scene {

    private resourceHolder:ResourceHolder = new ResourceHolder(this);

    public override onReady():void {

        this.resourceHolder.progressBarPattern.stretchMode = STRETCH_MODE.REPEAT;

        this.backgroundColor = Color.fromCssLiteral(`#efefef`);
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);

        const mainSceneUI = new MainWidget(this.game,this.resourceHolder);
        mainSceneUI.mountTo(root);

    }

}

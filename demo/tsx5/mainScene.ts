import {Scene} from "@engine/scene/scene";
import {MainWidget} from "./ui/mainWidget";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {ResourceHolder} from "./resource/resourceHolder";
import {STRETCH_MODE} from "@engine/renderable/impl/general/image/image";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.ResourceHolder() private resourceHolder:ResourceHolder;

    public override onReady():void {

        this.resourceHolder.progressBarPattern.stretchMode = STRETCH_MODE.REPEAT;

        this.backgroundColor = ColorFactory.fromCSS(`#efefef`);
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);

        const mainSceneUI = new MainWidget(this.game,this.resourceHolder);
        mainSceneUI.mountTo(root);

    }

}

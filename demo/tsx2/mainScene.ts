import {Scene} from "@engine/scene/scene";
import {MainSceneUi} from "./mainScene.ui";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";


export class MainScene extends Scene {

    public override onReady():void {
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);

        const mainSceneUI = new MainSceneUi(this.game);
        mainSceneUI.mountTo(root);
    }

}

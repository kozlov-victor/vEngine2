import {Scene} from "@engine/scene/scene";
import {MainSceneUi} from "./mainScene.ui";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";


export class MainScene extends Scene {

    public onReady() {
        const root = new NullGameObject(this.game);
        this.appendChild(root);

        const mainSceneUI = new MainSceneUi(this.game);
        mainSceneUI.mountTo(root);
    }

}

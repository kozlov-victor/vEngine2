import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {MainSceneUi} from "./mainScene.ui";
import {Source} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Source.Texture('./assets/star.png')
    private link:ResourceLink<ITexture>;

    public onReady() {
        const mainSceneUI = new MainSceneUi(this.link);
        const root = mainSceneUI.render();
        this.appendChild(root);
    }

}

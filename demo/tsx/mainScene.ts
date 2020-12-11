import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {MainSceneUi} from "./mainScene.ui";
import {Resource} from "@engine/resources/resourceDecorators";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";


export class MainScene extends Scene {

    @Resource.Texture('./assets/star.png')
    private link:ResourceLink<ITexture>;

    public onReady():void {
        const root = new NullGameObject(this.game);
        this.appendChild(root);

        const mainSceneUI = new MainSceneUi(this.game,this.link);
        mainSceneUI.mountTo(root);
    }

}

import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {MainSceneUi} from "./mainScene.ui";
import {Resource} from "@engine/resources/resourceDecorators";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";


export class MainScene extends Scene {

    @Resource.Texture('./assets/star.png')
    private link:ITexture;

    public override onReady():void {
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);

        const mainSceneUI = new MainSceneUi(this.game,this.link);
        mainSceneUI.mountTo(root);
    }

}

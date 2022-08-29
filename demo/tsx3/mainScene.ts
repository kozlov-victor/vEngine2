import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {MainWidget} from "./ui/mainWidget";
import {Resource} from "@engine/resources/resourceDecorators";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";


export class MainScene extends Scene {

    @Resource.Texture('./assets/star.png')
    public readonly link:ITexture;

    public override onReady():void {
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);

        const mainSceneUI = new MainWidget(this.game);
        mainSceneUI.mountTo(root);
    }

}

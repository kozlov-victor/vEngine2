import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {MainComponent} from "./ui/mainComponent";
import {Resource} from "@engine/resources/resourceDecorators";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {VEngineTsxDOM} from "@engine/renderable/tsx/vEngineTsxDOM";


export class MainScene extends Scene {

    @Resource.Texture('./assets/star.png')
    private link:ResourceLink<ITexture>;

    public onReady() {
        const root = new NullGameObject(this.game);
        this.appendChild(root);

        const mainSceneUI = new MainComponent(this.link);
        VEngineTsxDOM.render(mainSceneUI,root);
    }

}

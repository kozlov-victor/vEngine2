import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {MainSceneUi} from "./mainScene.ui";


export class MainScene extends Scene {

    private link:ResourceLink<ITexture>;

    public onReady() {
        this.appendChild(new MainSceneUi().render());
    }

}

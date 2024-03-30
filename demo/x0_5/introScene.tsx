import {Scene} from "@engine/scene/scene";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";
import {Game} from "@engine/core/game";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Resource} from "@engine/resources/resourceDecorators";
import {Assets} from "./assets/assets";
import {GameScene} from "./gameScene";

export class IntroSceneUi extends VEngineRootComponent {

    constructor(game: Game, private assets: Assets) {
        super(game);
    }

    private go() {
        this.game.runScene(new GameScene(this.game));
    }

    public render(): JSX.Element {
        return (
            <>
                <v_image texture={this.assets.bg}/>
                <v_image pos={{x:25,y:25}} texture={this.assets.logo}/>
                <v_image click={()=>this.go()} pos={{x:150,y:270}} texture={this.assets.arrow}/>
            </>
        )
    }

}

export class IntroScene extends Scene {

    @Resource.ResourceHolder() private assets: Assets;

    override onReady() {

        const root = new SimpleGameObjectContainer(this.game);
        root.appendTo(this);

        const ui = new IntroSceneUi(this.game,this.assets);
        ui.mountTo(root);
    }
}

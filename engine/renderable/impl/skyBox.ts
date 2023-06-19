import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {ICubeMapTexture} from "@engine/renderer/common/texture";

export class SkyBox extends RenderableModel {

    constructor(game:Game,public texture:ICubeMapTexture) {
        super(game);
    }

    public override draw(): void {
        this.game.getRenderer<WebGlRenderer>().drawSkyBox(this);
    }

}

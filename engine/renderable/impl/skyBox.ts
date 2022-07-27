import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {CubeMapTexture} from "@engine/renderer/webGl/base/cubeMapTexture";

export class SkyBox extends RenderableModel {

    constructor(game:Game,public texture:CubeMapTexture) {
        super(game);
    }

    public override draw(): void {
        this.game.getRenderer<WebGlRenderer>().drawSkyBox(this);
    }

}

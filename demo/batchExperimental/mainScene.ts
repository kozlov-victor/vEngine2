import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import * as ts from "typescript/lib/tsserverlibrary";
import {Game} from "@engine/core/game";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";


class ExperimentalModel extends RenderableModel {

    constructor(game: Game) {
        super(game);
    }

    override draw() {
        const glRenderer = this.game.getRenderer<WebGlRenderer>();
        glRenderer.drawExperimentalBatch(this);
    }
}

export class MainScene extends Scene {

    public override onReady():void {
        const model = new ExperimentalModel(this.game);
        model.size.setWH(200,100);
        model.pos.setXY(0,40);
        model.transformPoint.setToCenter();
        // model.setInterval(()=>{
        //     model.angle+=0.1;
        // },1);
        model.addBehaviour(new DraggableBehaviour(this.game));
        model.appendTo(this);
    }

}

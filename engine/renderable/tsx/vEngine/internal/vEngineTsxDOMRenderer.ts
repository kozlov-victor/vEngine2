import {AbstractTsxDOMRenderer} from "@engine/renderable/tsx/_genetic/abstractTsxDOMRenderer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {VEngineElementCreator} from "@engine/renderable/tsx/vEngine/internal/vEngineElementCreator";


export class VEngineTsxDOMRenderer extends AbstractTsxDOMRenderer<RenderableModel> {

    constructor(private game:Game) {
        super(new VEngineElementCreator(game));
    }

}

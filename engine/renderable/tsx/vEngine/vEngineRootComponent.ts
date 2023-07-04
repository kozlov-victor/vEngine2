import {VEngineTsxComponent} from "@engine/renderable/tsx/_genetic/vEngineTsxComponent";
import {Game} from "@engine/core/game";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/internal/vEngineTsxDOMRenderer";


export abstract class VEngineRootComponent extends VEngineTsxComponent {

    constructor(protected game:Game) {
        super(new VEngineTsxDOMRenderer(game));
    }

}

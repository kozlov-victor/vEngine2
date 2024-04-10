import {VEngineTsxComponent} from "@engine/renderable/tsx/_genetic/vEngineTsxComponent";
import {Game} from "@engine/core/game";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/internal/vEngineTsxDOMRenderer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";


export abstract class VEngineRootComponent extends VEngineTsxComponent {

    constructor(protected game:Game) {
        super(new VEngineTsxDOMRenderer(game));
    }

    public override mountTo(root:RenderableModel):void {
        if (root.size.isZero()) {
            root.size.setFrom(this.game);
        }
        super.mountTo(root);
    }

}

import {BufferInfo} from "../../renderer/webGl/base/bufferInfo";
import {IPrimitive} from "../../renderer/webGl/primitives/abstractPrimitive";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {DebugError} from "@engine/debug/debugError";

export abstract class Mesh2d extends RenderableModel {

    public modelPrimitive:IPrimitive;
    public fillColor:Color = Color.BLACK.clone();
    public bufferInfo:BufferInfo;
    public vertexItemSize:2|3 = 2;

    protected constructor(game:Game) {
        super(game);
    }

    public override revalidate(): void {
        super.revalidate();
        if (DEBUG) {
            if (!this.modelPrimitive) throw new DebugError(`model primitive is not set`);
            if (this.modelPrimitive.vertexArr.length%this.vertexItemSize!==0) {
                console.error(this);
                throw new DebugError(
                    `Wrong vertexArr size, actual size is ${this.modelPrimitive.vertexArr.length},
                    but number must be a multiple of ${this.vertexItemSize} `
                );
            }
        }
    }

    public draw():void{
        this.game.getRenderer().drawMesh2d(this);
    }

    protected override setClonedProperties(cloned: Mesh2d): void {
        cloned.fillColor = this.fillColor.clone();
        cloned.depthTest = this.depthTest;
        cloned.bufferInfo =this.bufferInfo;
        super.setClonedProperties(cloned);
    }

}

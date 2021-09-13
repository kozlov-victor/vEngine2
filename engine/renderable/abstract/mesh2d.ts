import {BufferInfo} from "../../renderer/webGl/base/bufferInfo";
import {IPrimitive} from "../../renderer/webGl/primitives/abstractPrimitive";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {DebugError} from "@engine/debug/debugError";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";

export abstract class Mesh2d extends RenderableModel {

    public fillColor:Color = Color.BLACK.clone();

    public _modelPrimitive:IPrimitive;
    public _bufferInfo:BufferInfo;

    protected constructor(game:Game,modelPrimitive:IPrimitive,bufferInfo?:BufferInfo) {
        super(game);
        if (DEBUG) {
            if (!modelPrimitive) throw new DebugError(`model primitive is not set`);
            if (modelPrimitive.vertexArr.length%modelPrimitive.vertexItemSize!==0) {
                console.error(this);
                throw new DebugError(
                    `Wrong vertexArr size, actual size is ${modelPrimitive.vertexArr.length},
                    but number must be a multiple of ${modelPrimitive.vertexItemSize} `
                );
            }
        }
        this._modelPrimitive = modelPrimitive;
        this._bufferInfo = bufferInfo ?? this.game.getRenderer<WebGlRenderer>().initBufferInfo(this);
    }

    public override draw():void{
        this.game.getRenderer().drawMesh2d(this);
    }

    public override destroy():void {
        this._bufferInfo.destroy();
        super.destroy();
    }


    protected override setClonedProperties(cloned: Mesh2d): void {
        cloned.fillColor = this.fillColor.clone();
        cloned.depthTest = this.depthTest;
        cloned._bufferInfo = this._bufferInfo;
        cloned._modelPrimitive = this._modelPrimitive;
        super.setClonedProperties(cloned);
    }

}

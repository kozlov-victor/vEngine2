import {IPrimitive} from "../../renderer/webGl/primitives/abstractPrimitive";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {DebugError} from "@engine/debug/debugError";
import type {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {BufferInfo} from "@engine/renderer/webGl/base/buffer/bufferInfo";

export abstract class Mesh2d extends RenderableModel {

    public fillColor:Color = Color.BLACK.clone();

    public _modelPrimitive:IPrimitive;
    private _bufferInfo:BufferInfo;

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
        this._bufferInfo = bufferInfo!;
    }

    public override draw():void{
        this.game.getRenderer().drawMesh2d(this);
    }

    public getBufferInfo():BufferInfo {
        if (this._bufferInfo===undefined) {
            this._bufferInfo =
                (this.game.getRenderer() as WebGlRenderer).initBufferInfo(this);
        }
        return this._bufferInfo;
    }

    public override destroy():void {
        this._modelPrimitive.texCoordArr = undefined;
        this._modelPrimitive.normalArr = undefined;
        this._modelPrimitive.vertexColorArr = undefined;
        if (
            this._bufferInfo!==undefined && // it can be uninitialized
            !this._bufferInfo.isDestroyed())  // it can be already destroyed by cloned object, with use the same bufferInfo
        {
            (this.game.getRenderer() as WebGlRenderer).destroyMesh(this);
        }
        super.destroy();
    }


    protected override setClonedProperties(cloned: Mesh2d): void {
        cloned.fillColor = this.fillColor.clone();
        cloned.depthTest = this.depthTest;
        cloned._bufferInfo = this.getBufferInfo();
        cloned._modelPrimitive = this._modelPrimitive;
        super.setClonedProperties(cloned);
    }

}

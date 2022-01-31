import {Game} from "@engine/core/game";
import {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";
import {IPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {ICloneable} from "@engine/core/declarations";
import {BufferInfo} from "@engine/renderer/webGl/base/bufferInfo";

export class Model3d extends Mesh3d implements ICloneable<Model3d>{

    constructor(game:Game,modelPrimitive:IPrimitive,bufferInfo?:BufferInfo) {
        super(game,modelPrimitive,bufferInfo);
        this.invertY = true;
        this.depthTest = true;
    }

    public clone(): Model3d {
        const cloned:Model3d = new Model3d(this.game,this._modelPrimitive,this.getBufferInfo());
        this.setClonedProperties(cloned);
        return cloned;
    }

}

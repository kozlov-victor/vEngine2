import {FbxAbstractParser, IFbxParams} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxAbstractParser";
import {FbxReader, parseBinary} from "@engine/renderable/impl/3d/fbxParser/_internal";
import {Game} from "@engine/core/game";

export class FbxBinaryParser extends FbxAbstractParser{
    constructor(game:Game,buff:ArrayBuffer,params:IFbxParams = {}) {
        super(game,new FbxReader(parseBinary(buff)),params);
    }
}

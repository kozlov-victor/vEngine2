import {Game} from "@engine/core/game";
import {FbxAbstractParser} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxAbstractParser";
import {IFbxParams} from "@engine/renderable/impl/3d/fbxParser/_internal/types";
import {FbxReader} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxReader";
import {parseBinary} from "@engine/renderable/impl/3d/fbxParser/_internal/binary";

export class FbxBinaryParser extends FbxAbstractParser{
    constructor(game:Game,buff:ArrayBuffer,params:IFbxParams = {}) {
        super(game,new FbxReader(parseBinary(buff)),params);
    }
}

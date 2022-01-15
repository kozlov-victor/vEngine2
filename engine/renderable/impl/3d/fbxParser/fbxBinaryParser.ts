import {AbstractParser, IFbxParams} from "@engine/renderable/impl/3d/fbxParser/_internal/abstractParser";
import {FbxReader, parseBinary} from "@engine/renderable/impl/3d/fbxParser/_internal";
import {Game} from "@engine/core/game";

export class FbxBinaryParser extends AbstractParser{
    constructor(game:Game,buff:ArrayBuffer,params:IFbxParams = {}) {
        super(game,new FbxReader(parseBinary(buff)));
    }
}

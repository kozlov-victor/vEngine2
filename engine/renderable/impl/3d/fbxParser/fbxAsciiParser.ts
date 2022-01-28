import {FbxAbstractParser, IFbxParams} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxAbstractParser";
import {FbxReader, parseText} from "@engine/renderable/impl/3d/fbxParser/_internal";
import {Game} from "@engine/core/game";

export class FbxAsciiParser extends FbxAbstractParser{
    constructor(game:Game,text:string,params:IFbxParams = {}) {
        super(game,new FbxReader(parseText(text)),params);
    }
}

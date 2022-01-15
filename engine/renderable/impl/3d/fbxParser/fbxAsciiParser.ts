import {AbstractParser, IFbxParams} from "@engine/renderable/impl/3d/fbxParser/_internal/abstractParser";
import {FbxReader, parseText} from "@engine/renderable/impl/3d/fbxParser/_internal";
import {Game} from "@engine/core/game";

export class FbxAsciiParser extends AbstractParser{
    constructor(game:Game,text:string,params:IFbxParams = {}) {
        super(game,new FbxReader(parseText(text)));
    }
}

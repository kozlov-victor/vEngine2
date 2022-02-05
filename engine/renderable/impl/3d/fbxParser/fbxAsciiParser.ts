
import {Game} from "@engine/core/game";
import {FbxAbstractParser} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxAbstractParser";
import {IFbxParams} from "@engine/renderable/impl/3d/fbxParser/_internal/types";
import {FbxReader} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxReader";
import {parseText} from "@engine/renderable/impl/3d/fbxParser/_internal/ascii";

export class FbxAsciiParser extends FbxAbstractParser{
    constructor(game:Game,text:string,params:IFbxParams = {}) {
        super(game,new FbxReader(parseText(text)),params);
    }
}

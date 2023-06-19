import {ITexture} from "@engine/renderer/common/texture";
import {ISize} from "@engine/geometry/size";
import {Game} from "@engine/core/game";

export class DomTexture implements ITexture {

    public __kind__ =  'Texture'as const;
    public imageUrl:string;

    constructor(game:Game,public size:ISize,div?:HTMLDivElement) {

    }

    public destroy(): void {
    }

    public isDestroyed(): boolean {
        return false;
    }



}

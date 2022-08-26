import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Color} from "@engine/renderer/common/color";
import {ITexture} from "@engine/renderer/common/texture";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {DomTexture} from "@engine/renderer/dom/domTexture";

export class DomRenderTarget implements IRenderTarget {

    private texture:DomTexture;

    constructor(game:Game,private size:ISize,div?:HTMLDivElement) {
        this.texture = new DomTexture(game, size);
    }

    public bind(): void {
    }

    public clear(color: Color, withDepth?: boolean, alphaBlendValue?: number): void {
    }

    public destroy(): void {
    }

    getTexture(): ITexture {
        return this.texture;
    }




}

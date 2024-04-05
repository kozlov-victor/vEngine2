import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {CanvasTexture} from "@engine/renderer/canvas/canvasTexture";
import {ISize} from "@engine/geometry/size";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";

export class CanvasRenderTarget implements IRenderTarget{

    private readonly texture:CanvasTexture;

    constructor(game:Game,private size:ISize,canvas?:HTMLCanvasElement) {
        this.texture = new CanvasTexture(game, size, canvas);
    }

    public destroy(): void {
    }

    public getTexture(): CanvasTexture {
        return this.texture;
    }

    public bind(): void {
    }

    public clear(color: Color, withDepth?: boolean, alphaBlendValue?: number): void {
        this.texture.clear(color);
    }


}

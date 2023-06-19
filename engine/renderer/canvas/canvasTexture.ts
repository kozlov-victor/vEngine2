import {ITexture} from "@engine/renderer/common/texture";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";

export class CanvasTexture implements ITexture {

    public __kind__ = 'Texture' as const;
    private readonly context:CanvasRenderingContext2D;
    private readonly canvas:HTMLCanvasElement;

    constructor(game:Game,public size:ISize,canvas?:HTMLCanvasElement) {
        if (canvas===undefined) {
            canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
        }
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
    }

    public getContext():CanvasRenderingContext2D {
        return this.context;
    }

    public getCanvas():HTMLCanvasElement {
        return this.canvas;
    }

    public destroy() {
    }

    public isDestroyed(): boolean {
        return false;
    }

}

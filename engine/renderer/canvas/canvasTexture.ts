import {ITexture} from "@engine/renderer/common/texture";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {Color} from "@engine/renderer/common/color";
import {ICanvasRenderingContext2DEx} from "@engine/renderer/canvas/canvasRenderer";

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
        this.clear(Color.NONE);
    }

    public getContext():CanvasRenderingContext2D {
        return this.context;
    }

    public clear(color:Color) {
        const ctx = this.context;
        ctx.clearRect(0,0,this.size.width,this.size.height);
        ctx.fillStyle = color.asCssRgba();
        ctx.fillRect(0,0,this.size.width,this.size.height);
    }

    public setPixelPerfect(val:boolean) {
        const context = this.context as ICanvasRenderingContext2DEx;
        context.webkitImageSmoothingEnabled = !val;
        context.mozImageSmoothingEnabled = !val;
        context.msImageSmoothingEnabled = !val;
        context.imageSmoothingEnabled = !val;
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

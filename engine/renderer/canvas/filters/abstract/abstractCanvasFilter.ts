import {IFilter} from "@engine/renderer/common/ifilter";

export abstract class AbstractCanvasFilter implements IFilter {

    public readonly type:string = 'CanvasFilter';

    public abstract processPixel(arr:Uint8ClampedArray,i:number):void;

    public doFilter(ctx:CanvasRenderingContext2D):void{
        const imgData:ImageData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
        const arr:Uint8ClampedArray = imgData.data;
        for (let i:number=0,max:number=arr.length;i<max;i+=4) {
            this.processPixel(arr,i);
        }
    }

}

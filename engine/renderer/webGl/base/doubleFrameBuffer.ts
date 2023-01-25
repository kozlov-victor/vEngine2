// array of two frameBuffer for filters to apply
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ISize} from "@engine/geometry/size";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";

export class DoubleFrameBuffer {

    private readonly buffers:[FrameBuffer,FrameBuffer];

    constructor(private readonly _gl:WebGLRenderingContext,size:ISize){
        this.buffers = [
            new FrameBuffer(_gl,size),
            new FrameBuffer(_gl,size)
        ];
    }

    public setInterpolationMode(mode:INTERPOLATION_MODE):void {
        this.buffers[0].getTexture().setInterpolationMode(mode);
        this.buffers[1].getTexture().setInterpolationMode(mode);
    }

    public applyFilters(texture:Texture,nextFrameBuffer:FrameBuffer,filters:readonly AbstractGlFilter[]):Texture{
        const len:number = filters.length;
        if (len===0) return texture;

        const filter:AbstractGlFilter = filters[0];
        if (!filter.enabled) return texture;

        filter.getPainter().attachTexture('texture',texture);
        filter.doFilter(this.getDestBuffer(),nextFrameBuffer);
        for (let i:number=1;i<len;++i){
            if (!filters[i].enabled) continue;
            this.flip();
            filters[i].getPainter().attachTexture('texture',this.getSourceBuffer().getTexture());
            filters[i].doFilter(this.getDestBuffer(),nextFrameBuffer);
        }
        this.flip();
        return this.getSourceBuffer().getTexture();
    }

    public destroy():void{
        this.buffers.forEach((b:FrameBuffer)=>b.destroy());
    }

    private flip():void{
        const tmp:FrameBuffer = this.buffers[0];
        this.buffers[0] = this.buffers[1];
        this.buffers[1] = tmp;
    }

    private getSourceBuffer():FrameBuffer{
        return this.buffers[0];
    }

    private getDestBuffer():FrameBuffer{
        return this.buffers[1];
    }

}

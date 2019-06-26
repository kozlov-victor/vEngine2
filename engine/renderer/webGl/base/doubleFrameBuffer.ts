// array of two frameBuffer for filters to apply
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";

export class DoubleFrameBuffer {

    private gl:WebGLRenderingContext;
    private readonly buffers:[FrameBuffer,FrameBuffer];

    constructor(gl:WebGLRenderingContext,width:number,height:number){
        this.gl = gl;
        this.buffers = [
            new FrameBuffer(gl,width,height),
            new FrameBuffer(gl,width,height)
        ];
    }

    public applyFilters(texture:Texture,filters:readonly AbstractFilter[]):Texture{
        const len:number = filters.length;
        if (len===0) return texture;

        const filter:AbstractFilter = filters[0];

        filter.getDrawer().attachTexture('texture',texture);
        filter.doFilter(this.getDestBuffer());
        for (let i:number=1;i<len;i++){
            this.flip();
            filters[i].getDrawer().attachTexture('texture',this.getSourceBuffer().getTexture());
            filters[i].doFilter(this.getDestBuffer());
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
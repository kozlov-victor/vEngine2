// array of two frameBuffer for filters to apply
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {TextureInfo} from "@engine/renderer/webGl/programs/abstract/abstractDrawer";
import {Int} from "@engine/declarations";

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

    applyFilters(texture:Texture,filters:AbstractFilter[]):Texture{
        const len:number = filters.length;
        if (len===0) return texture;

        const filter:AbstractFilter = filters[0];

        const texInfo:TextureInfo[] = [{texture,name:'texture'}]; // todo make this array reusable
        filter.doFilter(texInfo,this.getDestBuffer());
        for (let i:number=1;i<len;i++){
            this.flip();
            let texInfo:TextureInfo[] = [{texture:this.getSourceBuffer().getTexture(),name:'texture'}];
            filters[i].doFilter(
                texInfo, this.getDestBuffer()
            );
        }
        this.flip();
        return this.getSourceBuffer().getTexture();
    }

    destroy():void{
        this.buffers.forEach((b:FrameBuffer)=>b.destroy());
    }

}
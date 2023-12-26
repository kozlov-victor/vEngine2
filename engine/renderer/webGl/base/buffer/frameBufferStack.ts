
import {ISize} from "@engine/geometry/size";
import {IDestroyable} from "@engine/core/declarations";
import {Color} from "@engine/renderer/common/color";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {SimpleRectPainter} from "@engine/renderer/webGl/painters/impl/base/simpleRect/simpleRectPainter";
import {Game} from "@engine/core/game";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {Device} from "@engine/misc/device";
import {ITexture} from "@engine/renderer/common/texture";
import {Incrementer} from "@engine/resources/incrementer";
import {FrameBuffer} from "@engine/renderer/webGl/base/buffer/frameBuffer";
import {DoubleFrameBuffer} from "@engine/renderer/webGl/base/buffer/doubleFrameBuffer";
import {Texture} from "@engine/renderer/webGl/base/texture/texture";

interface IStackItem {
    frameBuffer:FrameBuffer;
    filters:readonly AbstractGlFilter[];
    pointer:IStateStackPointer;
    alpha:number;
}

export interface IStateStackPointer {
    ptr:number;
}


const NONE_FILTERS:readonly AbstractGlFilter[] = [];


export class FrameBufferStack implements IDestroyable, IRenderTarget{


    private _stackPointer:number;
    private readonly _stack:IStackItem[] = [];
    private _interpolationMode:INTERPOLATION_MODE = INTERPOLATION_MODE.LINEAR;

    private _doubleFrameBuffer:DoubleFrameBuffer;

    private _pixelPerfectMode:boolean = false;
    private _simpleRectPainter:SimpleRectPainter;
    private _blender:Blender = Blender.getSingleton(this._gl);

    private readonly _resourceTexture:ITexture;
    private _destroyed:boolean = false;

    public readonly id:number = Incrementer.getValue();

    constructor(protected readonly game:Game,private readonly _gl:WebGLRenderingContext, private readonly _size:ISize){
        this._stack.push({
            frameBuffer: new FrameBuffer(this._gl,this._size),
            filters:NONE_FILTERS,
            pointer: {ptr:0},
            alpha: 1,
        });
        this._stackPointer = 1;

        this._simpleRectPainter = new SimpleRectPainter(_gl);
        this._simpleRectPainter.initProgram();

        this._blender.enable();
        this._blender.setBlendMode(BLEND_MODE.NORMAL);
        this._resourceTexture = this._getFirst().frameBuffer.getTexture();

    }

    public pushState(filters:AbstractGlFilter[],alpha:number,forceDrawChildrenOnNewSurface:boolean):IStateStackPointer{
        const prevPointer:IStateStackPointer = this._getLast().pointer;
        if (filters.length>0 || alpha!==1 || forceDrawChildrenOnNewSurface) {
            if (this._stack[this._stackPointer]===undefined) {
                this._stack[this._stackPointer] = {
                    frameBuffer: new FrameBuffer(this._gl,this._size),
                    filters:NONE_FILTERS,
                    alpha,
                    pointer: {ptr:this._stackPointer}
                };
            }
            this._stack[this._stackPointer].filters = filters;
            this._stack[this._stackPointer].alpha = alpha;
            this._stack[this._stackPointer].frameBuffer.bind();
            this._stack[this._stackPointer].frameBuffer.clear(Color.NONE,false);
            ++this._stackPointer;
        } else {
            this._getLast().frameBuffer.bind();
        }
        return prevPointer;
    }

    public bind():void {
        this._getLast().frameBuffer.bind();
    }

    public clear(color:Color,widthDepth:boolean,alphaBlend?:number):void{
        for (const b of this._stack) {
            b.frameBuffer.bind();
            b.frameBuffer.clear(color,widthDepth,alphaBlend);
        }
    }

    public setInterpolationMode(interpolation:INTERPOLATION_MODE):void{
        this._getLast().frameBuffer.setInterpolationMode(interpolation);
        this._getDoubleFrameBuffer().setInterpolationMode(interpolation);
        this._interpolationMode = interpolation;
    }


    public getCurrentTargetSize():ISize{
        return this._getLast().frameBuffer.getTexture().size;
    }

    public setPixelPerfect(mode:boolean):void {
        this._pixelPerfectMode = mode;
    }

    public getStackSize():number {
        return this._stackPointer;
    }

    public destroy():void{
        this._stack.forEach(f=>f.frameBuffer.destroy());
        if (this._doubleFrameBuffer!==undefined) this._doubleFrameBuffer.destroy();
        this._simpleRectPainter.destroy();
    }

    public isDestroyed(): boolean {
        return this._destroyed;
    }

    public reduceState(to:IStateStackPointer):void{
        if (this._stackPointer===1) return;
        for (let i = this._stackPointer-1; i>to.ptr; --i) {
            const currItem:IStackItem = this._stack[i];
            const nextItem:IStackItem = this._stack[i-1];

            const filteredTexture =
                this._getDoubleFrameBuffer().applyFilters(
                    currItem.frameBuffer.getTexture(),
                    nextItem.frameBuffer,
                    currItem.filters
                );
            currItem.filters = NONE_FILTERS;

            nextItem.frameBuffer.bind();
            nextItem.frameBuffer.setInterpolationMode(this._interpolationMode);
            this._simpleRectPainter.setUniform(this._simpleRectPainter.u_alpha,currItem.alpha);
            this._simpleRectPainter.setUniform(this._simpleRectPainter.u_flip,false);
            this._simpleRectPainter.attachTexture('texture',filteredTexture);
            this._blender.setBlendMode(BLEND_MODE.NORMAL);
            this._simpleRectPainter.draw();
        }
        this._stackPointer = to.ptr + 1;
    }

    public renderToScreen():void{
        this._blender.setBlendMode(BLEND_MODE.NORMAL);
        const needFullScreen = this._pixelPerfectMode || Device.embeddedEngine;
        const w = needFullScreen?this.game.getRenderer().viewPortSize.width:this.game.size.width;
        const h = needFullScreen?this.game.getRenderer().viewPortSize.height:this.game.size.height;
        FrameBuffer.getCurrent().unbind();
        this._gl.viewport(0, 0, w,h);
        this._simpleRectPainter.setUniform(this._simpleRectPainter.u_alpha,1);
        this._simpleRectPainter.setUniform(this._simpleRectPainter.u_flip,true);
        this._simpleRectPainter.attachTexture('texture',this._getLast().frameBuffer.getTexture());
        this._simpleRectPainter.draw();
    }

    public getTexture(): ITexture {
        return this._resourceTexture;
    }

    private _getLast():IStackItem{
        return this._stack[this._stackPointer-1];
    }

    private _getFirst():IStackItem{
        return this._stack[0];
    }

    private _getDoubleFrameBuffer():DoubleFrameBuffer {
        if (this._doubleFrameBuffer===undefined) this._doubleFrameBuffer = new DoubleFrameBuffer(this._gl,this._size);
        return this._doubleFrameBuffer;
    }


}

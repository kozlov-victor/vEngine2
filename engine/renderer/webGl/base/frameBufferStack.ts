import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {ISize} from "@engine/geometry/size";
import {IDestroyable} from "@engine/core/declarations";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Color} from "@engine/renderer/common/color";
import {DoubleFrameBuffer} from "@engine/renderer/webGl/base/doubleFrameBuffer";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {Mat4} from "@engine/geometry/mat4";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectDrawer";
import {Game} from "@engine/core/game";
import {FLIP_TEXTURE_MATRIX, makeIdentityPositionMatrix} from "@engine/renderer/webGl/renderer/webGlRendererHelper";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {Device} from "@engine/misc/device";
import {ITexture} from "@engine/renderer/common/texture";
import IDENTITY = Mat4.IDENTITY;
import Mat16Holder = Mat4.Mat16Holder;

interface IStackItem {
    frameBuffer:FrameBuffer;
    filters:readonly AbstractGlFilter[];
    pointer:IStateStackPointer;
}

export interface IStateStackPointer {
    ptr:number;
}

let FLIP_POSITION_MATRIX:Mat16Holder;

const NONE_FILTERS:readonly AbstractGlFilter[] = [];


export class FrameBufferStack implements IDestroyable, IRenderTarget{


    private _stackPointer:number;
    private readonly _stack:IStackItem[] = [];
    private _interpolationMode:INTERPOLATION_MODE = INTERPOLATION_MODE.LINEAR;

    private _doubleFrameBuffer:DoubleFrameBuffer;

    private _pixelPerfectMode:boolean = false;
    private _simpleRectDrawer:SimpleRectDrawer;
    private _blender:Blender = Blender.getSingleton(this._gl);

    private readonly _resourceTexture:ITexture;

    constructor(protected readonly game:Game,private readonly _gl:WebGLRenderingContext, private readonly _size:ISize){
        this._stack.push({
            frameBuffer: new FrameBuffer(this._gl,this._size),
            filters:NONE_FILTERS,
            pointer: {ptr:0}
        });
        this._stackPointer = 1;

        this._simpleRectDrawer = new SimpleRectDrawer(_gl);
        this._simpleRectDrawer.initProgram();

        this._blender.enable();
        this._blender.setBlendMode(BLEND_MODE.NORMAL);

        if (FLIP_POSITION_MATRIX===undefined) {
            const m16hResult:Mat16Holder = Mat16Holder.fromPool();
            const m16Scale:Mat16Holder = Mat16Holder.fromPool();
            Mat4.makeScale(m16Scale,this.game.size.width, this.game.size.height, 1);
            const m16Ortho:Mat16Holder = Mat16Holder.fromPool();
            Mat4.ortho(m16Ortho,0,this.game.size.width,0,this.game.size.height,-1,1);

            Mat4.matrixMultiply(m16hResult, m16Scale, m16Ortho);
            FLIP_POSITION_MATRIX = m16hResult.clone();

            m16hResult.release();
            m16Scale.release();
            m16Ortho.release();
        }
        this._resourceTexture = this._getFirst().frameBuffer.getTexture();

    }

    public pushState(filters:AbstractGlFilter[],forceDrawChildrenOnNewSurface:boolean):IStateStackPointer{
        const prevPointer:IStateStackPointer = this._getLast().pointer;
        if (filters.length>0 || forceDrawChildrenOnNewSurface) {
            if (this._stack[this._stackPointer]===undefined) {
                this._stack[this._stackPointer] = {
                    frameBuffer: new FrameBuffer(this._gl,this._size),
                    filters:NONE_FILTERS,
                    pointer: {ptr:this._stackPointer}
                };
            }
            this._stack[this._stackPointer].filters = filters;
            this._stack[this._stackPointer].frameBuffer.bind();
            this._stack[this._stackPointer].frameBuffer.clear(Color.NONE,false);
            this._stackPointer++;
        } else {
            this._getLast().frameBuffer.bind();
        }
        return prevPointer;
    }

    public clear(color:Color,alphaBlend?:number):void{
        for (const b of this._stack) {
            b.frameBuffer.bind();
            b.frameBuffer.clear(color,true,alphaBlend);
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
        this._simpleRectDrawer.destroy();
    }

    public reduceState(to:IStateStackPointer):void{
        if (this._stackPointer===1) return;
        for (let i:number = this._stackPointer-1; i>to.ptr; i--) {
            const currItem:IStackItem = this._stack[i];
            const nextItem:IStackItem = this._stack[i-1];

            const filteredTexture:Texture = this._getDoubleFrameBuffer().applyFilters(currItem.frameBuffer.getTexture(),currItem.filters);
            currItem.filters = NONE_FILTERS;

            nextItem.frameBuffer.bind();
            nextItem.frameBuffer.setInterpolationMode(this._interpolationMode);
            this._simpleRectDrawer.setUniform(this._simpleRectDrawer.u_textureMatrix,IDENTITY);
            const m16h:Mat16Holder = makeIdentityPositionMatrix(0,0,this._getLast().frameBuffer.getTexture().size);
            this._simpleRectDrawer.setUniform(this._simpleRectDrawer.u_vertexMatrix,m16h.mat16);
            this._simpleRectDrawer.attachTexture('texture',filteredTexture);
            this._blender.setBlendMode(BLEND_MODE.NORMAL);
            this._simpleRectDrawer.draw();
            m16h.release();
        }
        this._stackPointer = to.ptr + 1;
    }

    public renderToScreen():void{
        this._blender.setBlendMode(BLEND_MODE.NORMAL);
        const needFullScreen:boolean = this._pixelPerfectMode || Device.embeddedEngine;
        const w:number = needFullScreen?this.game.getRenderer().viewPortSize.width:this.game.size.width;
        const h:number = needFullScreen?this.game.getRenderer().viewPortSize.height:this.game.size.height;
        FrameBuffer.getCurrent().unbind();
        this._gl.viewport(0, 0, ~~w,~~h);
        this._simpleRectDrawer.setUniform(this._simpleRectDrawer.u_textureMatrix,FLIP_TEXTURE_MATRIX.mat16);
        this._simpleRectDrawer.setUniform(this._simpleRectDrawer.u_vertexMatrix,FLIP_POSITION_MATRIX.mat16);
        this._simpleRectDrawer.attachTexture('texture',this._getLast().frameBuffer.getTexture());
        this._simpleRectDrawer.draw();
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
